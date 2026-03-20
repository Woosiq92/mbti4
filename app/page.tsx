import type { Metadata } from "next";
import HomePageClient from "./page.client";

const SITE_NAME = "MBTI × 사상체질 연구소";

export const metadata: Metadata = {
  title: SITE_NAME,
  description:
    "MBTI와 사상체질을 함께 해석해 나의 성향, 연애 방식, 스트레스 패턴, 회복 리듬을 알아보는 테스트",
  openGraph: {
    title: SITE_NAME,
    siteName: SITE_NAME,
    description:
      "익숙한 MBTI 위에 사상체질을 더해, 나를 조금 더 입체적으로 이해해보세요.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "익숙한 MBTI 위에 사상체질을 더해, 나를 조금 더 입체적으로 이해해보세요.",
    images: ["/og-image.png"],
    creator: "USC",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
