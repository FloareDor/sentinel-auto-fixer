import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel - Observable Repair Agent",
  description: "AI-powered CI/CD repair agent with glass box observability",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-win95-desktop">
        {children}
      </body>
    </html>
  );
}
