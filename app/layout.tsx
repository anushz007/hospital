import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediFlow Health - Hospital Management System",
  description: "Precision Healthcare Management Simplified. Empowering medical professionals and patients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background font-body text-on-surface">
        {children}
      </body>
    </html>
  );
}
