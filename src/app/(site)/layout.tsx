import Navbar from "@/components/Navbar";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
            <footer className="bg-slate-900 text-white py-12 text-center">
                <p>© 2026 Transformatif EduAction Hub - GREAT Edunesia</p>
            </footer>
        </>
    );
}
