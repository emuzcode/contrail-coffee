import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contrail Coffee & Chocolate",
  description: "Contrail Coffee & Chocolate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
