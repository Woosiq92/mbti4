import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = "MBTI × 사상체질 연구소";
const SITE_DESCRIPTION =
  "MBTI와 사상체질을 결합해 나의 성향, 연애 방식, 스트레스 패턴, 회복 리듬을 해석하는 자기이해형 테스트";

const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
let siteUrl: URL;
try {
  siteUrl = new URL(siteUrlRaw);
} catch {
  siteUrl = new URL("https://example.com");
}

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: SITE_NAME,
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "MBTI",
    "사상체질",
    "성격 테스트",
    "심리테스트",
    "자기이해",
    "연애 스타일 테스트",
    "성향 분석",
    "MBTI 사상체질",
  ],
  authors: [{ name: "USC" }],
  creator: "USC",
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "USC",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

