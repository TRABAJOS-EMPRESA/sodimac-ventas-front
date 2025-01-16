import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Radar VVEE",
  description: "Herramienta para la gestión de Oportunidades",
  icons: {
    icon: "/img/mi_radar_only_icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased bg-primary-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
