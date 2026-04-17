/**
 * Compress an image file using HTML5 Canvas.
 * @param file The original File object (image/jpeg, image/png, image/webp)
 * @param maxWidth The maximum width of the output image
 * @param maxHeight The maximum height of the output image
 * @param quality The compression quality (0.0 to 1.0)
 * @returns A Promise that resolves to a new File object
 */
export async function compressImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 720,
  quality = 0.6
): Promise<File> {
  // If the file is not an image that can be compressed via canvas or is too small, return as is.
  if (!file.type.match(/image\/(jpeg|png|webp)/i)) {
    return file;
  }

  // To save processing time, don't compress very small files (less than 100KB)
  if (file.size < 100 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file); // Fallback to original if canvas fails
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas context back to a Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            // Create a new File from the Blob
            const newFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            // If compressed file is somehow larger (happens sometimes with small PNGs), return original
            if (newFile.size > file.size) {
              resolve(file);
            } else {
              resolve(newFile);
            }
          },
          file.type, // Maintain original type
          quality
        );
      };

      img.onerror = (error) => {
        console.error("Image loading error for compression:", error);
        resolve(file); // Fallback to original
      };
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      resolve(file); // Fallback to original
    };
  });
}
