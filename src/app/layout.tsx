import type { Metadata } from "next";
import "./globals.css";
import { TaskBar } from "@/components/taskbar";
import { StatusBar } from "@/components/status-bar";

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
      <body className="min-h-screen flex flex-col bg-win95-desktop">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        <TaskBar />
        <StatusBar />
      </body>
    </html>
  );
}
