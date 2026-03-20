import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MBTI × 사상체질 연구소",
  description:
    "MBTI와 사상체질을 결합해 나의 성향, 연애 방식, 스트레스 패턴, 회복 리듬을 해석하는 테스트",
  openGraph: {
    title: "MBTI × 사상체질 연구소",
    description:
      "MBTI와 사상체질을 결합해 나의 성향, 연애 방식, 스트레스 패턴, 회복 리듬을 해석하는 테스트",
    type: "website",
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

