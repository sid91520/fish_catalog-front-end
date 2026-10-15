import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Mukta, Yatra_One } from "next/font/google";
import "./globals.css";

const yatra = Yatra_One({ weight: "400", subsets: ["latin", "devanagari"], variable: "--font-yatra", display: "swap" });
const mukta = Mukta({ weight: ["400", "500", "600"], subsets: ["latin", "devanagari"], variable: "--font-mukta", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Mumbaicha Masewala", template: "%s" },
  description: "Mumbaicha Masewala: ताजेपणाचा शाही अनुभव. Fresh fish and seafood, delivered fresh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${yatra.variable} ${mukta.variable}`}>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
