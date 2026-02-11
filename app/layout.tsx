import type { Metadata, Viewport } from "next";
import { Zen_Old_Mincho, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const zenOldMincho = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Contrail Coffee & Chocolate",
  description:
    "2026年、本格オープン予定。Contrail は「澄んだ余白に、香りが残るひととき。」をコンセプトに、秩父・東町に誕生するコーヒーとチョコレートの小さな喫茶店です。",
  keywords:
    "Contrail, コントレイル, コーヒー, チョコレート, カフェ, 秩父, 東町, 御花畑",
  authors: [{ name: "Contrail" }],
  openGraph: {
    title: "Contrail Coffee & Chocolate",
    description:
      "2026年、本格オープン予定。Contrail は「澄んだ余白に、香りが残るひととき。」をコンセプトに、秩父・東町に誕生するコーヒーとチョコレートの小さな喫茶店です。",
    type: "website",
    url: "https://www.contrail.life",
    locale: "ja_JP",
    siteName: "Contrail",
    images: [
      {
        url: "https://www.contrail.life/assets/images/contrail-logo-transparent.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contrail",
    description:
      "2026年、本格オープン予定。Contrail は「澄んだ余白に、香りが残るひととき。」をコンセプトに、秩父・東町に誕生するコーヒーとチョコレートの小さな喫茶店です。",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/assets/images/contrail-logo-transparent.png",
    apple: "/assets/images/contrail-logo-transparent.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${zenOldMincho.variable} ${notoSansJP.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
