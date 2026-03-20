import Link from "next/link";

import type { Metadata } from "next";

const SITE_NAME = "MBTI × 사상체질 연구소";

export const metadata: Metadata = {
  title: `개인정보처리방침 | ${SITE_NAME}`,
  description: `MBTI × 사상체질 연구소의 개인정보처리방침입니다.`,
  openGraph: {
    title: `개인정보처리방침 | ${SITE_NAME}`,
    siteName: SITE_NAME,
    description: `MBTI × 사상체질 연구소의 개인정보처리방침입니다.`,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `개인정보처리방침 | ${SITE_NAME}`,
    description: `MBTI × 사상체질 연구소의 개인정보처리방침입니다.`,
    images: ["/og-image.png"],
    creator: "USC",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-medium text-neutral-500">개인정보 처리방침</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Privacy Policy (간단 안내)
        </h1>

        <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
            본 서비스는 자기이해와 재미를 위한 콘텐츠로, 의료적 진단을 제공하지
            않습니다.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
            개인정보를 별도로 수집/저장하지 않는 MVP 형태로 운영되며, 테스트
            진행 정보는 사용자 브라우저의 로컬 저장소(`sessionStorage`)에만
            임시 보관됩니다.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
            문의: <a className="underline" href="mailto:contact@mbti-sasang-lab.com">contact@mbti-sasang-lab.com</a>
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

