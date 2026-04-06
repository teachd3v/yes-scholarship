import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Semua path publik yang perlu di-revalidate saat konten Sanity berubah
const PUBLIC_PATHS = ["/", "/blog", "/program", "/tentang-kami", "/alumni"];

// Map: tipe dokumen Sanity → path yang perlu di-revalidate
const TYPE_PATH_MAP: Record<string, string[]> = {
    hero: ["/"],
    stats: ["/"],
    partners: ["/"],
    faqs: ["/"],
    testimonial: ["/"],
    distribution: ["/"],
    post: ["/", "/blog"],
    program: ["/program"],
    about: ["/tentang-kami"],
    team: ["/tentang-kami"],
    ptn: ["/alumni"],
};

export async function POST(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get("secret");

    // Validasi secret token
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const documentType = body?._type as string | undefined;

        // Tentukan path mana yang perlu di-revalidate
        const pathsToRevalidate = documentType && TYPE_PATH_MAP[documentType]
            ? TYPE_PATH_MAP[documentType]
            : PUBLIC_PATHS; // fallback: revalidate semua

        pathsToRevalidate.forEach((path) => revalidatePath(path));

        console.log(`[Revalidate] type: ${documentType ?? "unknown"}, paths: ${pathsToRevalidate.join(", ")}`);

        return NextResponse.json({
            revalidated: true,
            paths: pathsToRevalidate,
        });
    } catch (err) {
        return NextResponse.json({ message: "Failed to revalidate", error: String(err) }, { status: 500 });
    }
}
