import type { Metadata } from "next";
import ResultPageClient from "./page.client";
import { getResultByCombination } from "../../lib/results";
import { parseMbtiChoiceFromStorage } from "../../lib/ui-mbti";
import { parseSasangTypeIdFromName } from "../../lib/sasang-data";

const SITE_NAME = "MBTI × 사상체질 연구소";
const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

const fallbackTitle = `테스트 결과 | ${SITE_NAME}`;
const fallbackDescription = "MBTI와 사상체질을 바탕으로 생성된 나의 성향 해석 결과";

function toFirstString(v: string | string[] | undefined): string | null {
  if (v == null) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const mbtiChoice = parseMbtiChoiceFromStorage(toFirstString(searchParams.mbti));
  const sasang = parseSasangTypeIdFromName(toFirstString(searchParams.sasang));

  if (!mbtiChoice || !sasang) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        type: "website",
        images: [OG_IMAGE],
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: [OG_IMAGE.url],
      },
    };
  }

  // 결과 페이지의 메타데이터는 “답안이 없는 공유 링크”에도 동작하도록,
  // 조합 기반 생성만 사용합니다.
  const result = getResultByCombination(mbtiChoice, sasang);
  const title = `${result.resultTitle} | ${SITE_NAME}`;
  const description = `${result.mbtiLabel} × ${result.sasangLabel} · ${result.summary}`;

  return {
    title,
    description,
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "USC",
      images: [OG_IMAGE.url],
    },
  };
}

export default function ResultPage() {
  return <ResultPageClient />;
}

