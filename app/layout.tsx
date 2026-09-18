import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SantotoFood",
  description:
    "Sistema de gestión de pedidos de SantotoFood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}