import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orion — Less noise. More progress.",
  description: "A calm workspace for your projects, tasks, and team. Turn your next idea into progress.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
