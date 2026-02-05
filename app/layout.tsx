import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Free. Then What - CRM",
  description: "CRM application for Free. Then What",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${redHatDisplay.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
