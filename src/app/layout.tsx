import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N5 FastTrack Learning Platform",
  description: "JLPT N5 speaking, listening, writing, reading, SRS, and gamified practice",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">{children}</body>
    </html>
  );
}
