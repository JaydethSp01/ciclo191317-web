export const dynamic = "force-dynamic";
import "./globals.css";
import { ProtectedShell } from "@/components/ui/ProtectedShell";

const NAV = [{ href: "/", label: "Inicio" }, { href: "/etiqueta", label: "Etiqueta" }, { href: "/nota", label: "Nota" }, { href: "/usuario", label: "Usuarios" }, { href: "/usuarios", label: "Usuarios" }];

export const metadata = { title: "NoteFlow — Notas para Estudiantes", description: "Generado con ScrumDev AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ProtectedShell items={NAV} title="NoteFlow — Notas para Estudiantes">{children}</ProtectedShell>
      </body>
    </html>
  );
}
