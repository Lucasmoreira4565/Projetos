export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* O {children} é a "gaveta" onde o Next.js vai desenhar a sua tela de login ou dashboard */}
            {children}
        </div>
    );
}