import nodemailer from 'nodemailer';

export async function sendConfirmationEmail(to: string, name: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"YES Scholarship" <${process.env.SMTP_USER}>`,
    to: to,
    subject: 'Pendaftaran Berhasil - YES Scholarship 2026',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Pendaftaran Berhasil!</h1>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #334155; margin-bottom: 24px;">Hai <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
            Terima kasih telah mendaftar di program <strong>Youth Ekselensia Scholarship (YES) 2026</strong>. 
            Data pendaftarannmu telah kami terima dan sedang dalam proses verifikasi.
          </p>
          <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0; color: #475569; font-style: italic;">
              "Setiap langkah kecil menuju pendidikan adalah lompatan besar bagi masa depan bangsa."
            </p>
          </div>
           <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 8px;">
            Nantikan pengumuman seleksi selanjutnya melalui Instagram resmi kami:
          </p>
          <p style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 32px;">
            <a href="https://instagram.com/youthekselensia.id" style="text-decoration: none; color: #2563eb;">@youthekselensia.id</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email confirmation sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error to prevent blocking the main response, just return false
    return { success: false, error };
  }
}
