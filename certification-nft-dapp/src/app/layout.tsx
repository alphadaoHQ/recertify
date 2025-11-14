import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TON Certificates",
  description: "NFT Credentials on TON Blockchain",
  other: {
    "telegram-web-app": "true",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="telegram-web-app" content="true" />
        <meta name="theme-color" content="#008080" />
      </head>
      <body className={`${inter.className} h-screen overflow-y-auto`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
