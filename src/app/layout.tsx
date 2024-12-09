import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { TimerWrapper } from "@/components/TimerWrapper";
import { HeaderTitle } from "@/components/HeaderTitle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PDF Flashcards",
  description: "Una aplicación para estudiar con tarjetas de memoria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64">
            <header className="h-20 border-b bg-white flex items-center justify-between px-4 pt-2">
              <HeaderTitle />
              <TimerWrapper />
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
