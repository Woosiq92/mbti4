"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DISCLAIMER } from "../lib/result-names";

const KEY_MBti = "mbtiChoice";
const KEY_SASANG_ANSWERS = "sasangAnswers";
const KEY_SASANG_STEP = "sasangStep";

export default function HomePage() {
  const router = useRouter();

  const previewResults = [
    {
      type: "INFP × 소음인",
      title: "조용한 내면형 해석자",
      desc: "깊은 감정과 섬세한 리듬 속에서 진짜 힘을 발휘하는 유형",
      keywords: ["섬세함", "깊은 몰입", "안정 지향"],
    },
    {
      type: "ENFP × 소양인",
      title: "불꽃 확산형 영감가",
      desc: "사람과 아이디어, 변화 속에서 살아나는 에너지형 유형",
      keywords: ["열정", "표현력", "가능성"],
    },
    {
      type: "ISTJ × 태음인",
      title: "축적형 원칙 관리자",
      desc: "안정감과 지속성을 바탕으로 묵직하게 성과를 쌓는 유형",
      keywords: ["책임감", "꾸준함", "루틴"],
    },
  ];

  const sasangTypes = [
    {
      name: "태양인",
      desc: "강하게 뻗어 나가는 추진력과 주도적인 발현력이 특징인 드문 유형",
    },
    {
      name: "태음인",
      desc: "묵직한 안정감과 축적형 리듬을 바탕으로 오래 밀고 가는 힘이 강한 유형",
    },
    {
      name: "소양인",
      desc: "빠른 반응, 표현력, 활동성이 두드러지는 에너지 확산형 유형",
    },
    {
      name: "소음인",
      desc: "신중함, 섬세함, 내적 안정감이 돋보이는 조용한 집중형 유형",
    },
  ];

  const handleStart = () => {
    sessionStorage.removeItem(KEY_MBti);
    sessionStorage.removeItem(KEY_SASANG_ANSWERS);
    sessionStorage.removeItem(KEY_SASANG_STEP);
    router.push("/test?reset=1");
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 shadow-sm sm:px-10 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium tracking-wide text-neutral-500">
              MBTI × 사상체질 연구소
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              당신의 MBTI에, 사상체질을 더하면
              <br className="hidden sm:block" />
              나를 더 입체적으로 이해할 수 있습니다
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              이미 알고 있는 MBTI에 동양의 체질 관점을 더해 나의 성향, 연애 방식,
              스트레스 패턴, 회복 리듬을 새롭게 해석해보세요.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-900 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                테스트 시작하기
              </button>
              <Link
                href="#about-sasang"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
              >
                사상체질 알아보기
              </Link>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
            MBTI는 직접 선택하고, 사상체질은 12개의 질문으로 확인합니다.
              1~2분이면 충분합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {previewResults.map((item) => (
              <div
                key={item.type}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm"
              >
                <p className="text-xs font-medium text-neutral-500">{item.type}</p>
                <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-neutral-900 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
                  {item.desc}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.keywords.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-800"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Sasang */}
        <section id="about-sasang" className="mt-16">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm sm:p-8">
              <p className="text-sm font-medium text-neutral-500">소개</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                사상체질이란 무엇일까요?
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-600 sm:text-base">
                <p>
                  사상체질은 사람의 몸과 기질을 네 가지 흐름으로 바라보는 동양의
                  전통적인 관점입니다.
                </p>
                <p>
                  이 서비스는 사상체질을 의학적 진단이 아니라,
                  <span className="font-semibold text-neutral-900">
                    {" "}
                    생활 성향과 에너지 흐름을 이해하는 자기이해 도구
                  </span>
                  로 가볍게 재해석합니다.
                </p>
                <p>
                  사람마다 반응 속도도 다르고, 스트레스를 받는 방식도 다르고,
                  회복하는 리듬도 다릅니다. 사상체질은 이런 차이를 태양인, 태음인,
                  소양인, 소음인이라는 네 가지 기질로 풀어봅니다.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm sm:p-8">
              <p className="text-sm font-medium text-neutral-500">핵심 포인트</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                MBTI와 함께 보면 더 잘 보입니다
              </h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-600 sm:text-base">
                <p>
                  MBTI가 사고와 관계의 방향을 보여준다면, 사상체질은 내가 어떤
                  방식으로 반응하고 소모되고 회복하는지를 보여줍니다.
                </p>
                <p>
                  이미 알고 있는 MBTI 위에 사상체질을 더하면, 나를 조금 더
                  현실적이고 생활감 있게 이해할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sasang Type Cards */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-500">네 가지 기질</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              네 가지 기질로 보는 나의 에너지 흐름
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
              이 테스트는 네 체질 중 지금의 당신과 더 가까운 기질을 가볍게
              살펴보는 콘텐츠입니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sasangTypes.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Section */}
        <section className="mt-16 rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-500">함께 보는 이유</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              왜 MBTI와 사상체질을 함께 볼까요?
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <p className="text-sm font-medium text-neutral-500">MBTI</p>
              <h3 className="mt-2 text-xl font-semibold">사고와 관계의 방향</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
                나는 어떤 방식으로 생각하고, 사람과 어떤 방식으로 관계 맺는가를
                보여줍니다.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <p className="text-sm font-medium text-neutral-500">사상체질</p>
              <h3 className="mt-2 text-xl font-semibold">반응과 회복의 리듬</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
                나는 어떤 방식으로 반응하고, 지치고, 다시 회복하는가를 보여줍니다.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-neutral-600 sm:text-base">
            익숙한 MBTI 위에 사상체질을 더하면, 조금 더 현실적이고 생활감 있는
            해석이 가능합니다.
          </p>
        </section>

        {/* Final CTA */}
        <section className="mt-16 rounded-3xl bg-neutral-900 px-6 py-12 text-white sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              내 MBTI에 어울리는 사상체질은 무엇일까?
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-300 sm:text-base">
              당신이 이미 알고 있는 MBTI를 선택하고, 12개의 질문으로 사상체질
              기질을 확인해보세요. 익숙한 성향 위에 새로운 해석이 더해집니다.
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
              >
                지금 테스트하기
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-12 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-neutral-600">{DISCLAIMER}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/privacy"
              className="text-sm font-medium text-neutral-600 underline underline-offset-4"
            >
              개인정보 처리방침
            </Link>
            <p className="text-sm text-neutral-600">
              문의:{" "}
              <a
                href="mailto:contact@mbti-sasang-lab.com"
                className="underline underline-offset-4"
              >
                contact@mbti-sasang-lab.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
