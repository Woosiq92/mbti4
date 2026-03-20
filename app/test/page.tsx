import type { Metadata } from "next";
import TestPageClient from "./page.client";

const SITE_NAME = "MBTI × 사상체질 연구소";

export const metadata: Metadata = {
  title: `테스트 시작하기 | ${SITE_NAME}`,
  description:
    "MBTI를 선택하고 12개의 질문으로 사상체질 기질을 확인해보세요.",
  openGraph: {
    title: `테스트 시작하기 | ${SITE_NAME}`,
    siteName: SITE_NAME,
    description:
      "12개의 질문으로 나의 반응 방식과 에너지 흐름을 가볍게 살펴보세요.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `테스트 시작하기 | ${SITE_NAME}`,
    description:
      "12개의 질문으로 나의 반응 방식과 에너지 흐름을 가볍게 살펴보세요.",
    images: ["/og-image.png"],
    creator: "USC",
  },
};

export default function TestPage() {
  return <TestPageClient />;
}

