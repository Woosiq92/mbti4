"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MbtiChoice, OptionKey } from "../../types";
import type { AnswerMap } from "../../types";
import { QUESTIONS, TOTAL_QUESTIONS } from "../../lib/questions";
import { calculateSasang, isCompleteTest } from "../../lib/scoring";
import { MBTI_ORDER, parseMbtiChoiceFromStorage } from "../../lib/ui-mbti";
import { SASANG_META } from "../../lib/sasang-data";

const KEY_MBti = "mbtiChoice";
const KEY_SASANG_ANSWERS = "sasangAnswers";
const KEY_SASANG_STEP = "sasangStep";

type TestStep = 1 | 2;

export default function TestPage() {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<TestStep>(1);

  const [mbtiChoice, setMbtiChoice] = useState<MbtiChoice | null>(null);
  const [sasangAnswers, setSasangAnswers] = useState<AnswerMap>({});
  const [sasangStep, setSasangStep] = useState(0); // 0-based index

  const currentQuestion = QUESTIONS[sasangStep];
  const chosen = sasangAnswers[currentQuestion?.id ?? ""];
  const isAnswered = chosen === "A" || chosen === "B";

  const progressPercent = useMemo(() => {
    if (!currentQuestion) return 0;
    return Math.round(((sasangStep + 1) / TOTAL_QUESTIONS) * 100);
  }, [sasangStep, currentQuestion]);

  useEffect(() => {
    const reset = new URLSearchParams(window.location.search).get("reset");
    if (reset) {
      sessionStorage.removeItem(KEY_MBti);
      sessionStorage.removeItem(KEY_SASANG_ANSWERS);
      sessionStorage.removeItem(KEY_SASANG_STEP);
      setMbtiChoice(null);
      setSasangAnswers({});
      setSasangStep(0);
      setStep(1);
      setHydrated(true);
      return;
    }

    try {
      const rawMbti = sessionStorage.getItem(KEY_MBti);
      const restoredMbti = parseMbtiChoiceFromStorage(rawMbti);
      const rawSasang = sessionStorage.getItem(KEY_SASANG_ANSWERS);
      const rawStep = sessionStorage.getItem(KEY_SASANG_STEP);

      if (restoredMbti) {
        setMbtiChoice(restoredMbti);
        setStep(2);
      }

      if (rawSasang) {
        const parsed = JSON.parse(rawSasang) as AnswerMap;
        if (parsed && typeof parsed === "object") setSasangAnswers(parsed);
      }

      if (rawStep) {
        const n = Number(rawStep);
        if (!Number.isNaN(n) && n >= 0 && n < TOTAL_QUESTIONS) setSasangStep(n);
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      // 빈 문자열 저장 시 결과 페이지가 MBTI 없음으로 오인할 수 있어, 미선택은 키 제거
      if (mbtiChoice != null) {
        sessionStorage.setItem(KEY_MBti, mbtiChoice);
      } else {
        sessionStorage.removeItem(KEY_MBti);
      }
      sessionStorage.setItem(KEY_SASANG_ANSWERS, JSON.stringify(sasangAnswers));
      sessionStorage.setItem(KEY_SASANG_STEP, String(sasangStep));
    } catch {
      // ignore
    }
  }, [hydrated, mbtiChoice, sasangAnswers, sasangStep]);

  const selectMbti = (choice: MbtiChoice) => {
    setMbtiChoice(choice);
  };

  const setAnswer = (key: OptionKey) => {
    if (!currentQuestion) return;
    setSasangAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }));
  };

  const goPrev = () => {
    setSasangStep((s) => Math.max(0, s - 1));
  };

  const goNext = () => {
    if (!currentQuestion) return;
    if (!isAnswered) return;

    if (sasangStep === TOTAL_QUESTIONS - 1) {
      if (!isCompleteTest(sasangAnswers, QUESTIONS)) return;
      // useEffect 저장보다 먼저 /result 로 이동하면 세션이 비어 있을 수 있음 → 동기 저장
      try {
        const mbtiToSave = mbtiChoice ?? "unknown";
        sessionStorage.setItem(KEY_MBti, mbtiToSave);
        sessionStorage.setItem(KEY_SASANG_ANSWERS, JSON.stringify(sasangAnswers));
      } catch {
        // ignore
      }
      const sasang = calculateSasang(sasangAnswers, QUESTIONS);
      const mbtiToSave = mbtiChoice ?? "unknown";
      const sasangName = SASANG_META[sasang].name;
      router.push(
        `/result?mbti=${encodeURIComponent(
          mbtiToSave
        )}&sasang=${encodeURIComponent(sasangName)}`
      );
      return;
    }

    setSasangStep((s) => Math.min(TOTAL_QUESTIONS - 1, s + 1));
  };

  const handleStartSasang = () => {
    if (!mbtiChoice) return;
    setStep(2);
    if (sasangStep < 0) setSasangStep(0);
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-2xl px-4 pb-12 pt-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">로딩 중...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pb-12 pt-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            테스트
          </h1>
          <p className="text-sm text-slate-600">
            {step === 1
              ? "Step 1: MBTI 선택"
              : `Step 2: 사상체질 검사 (${sasangStep + 1} / ${TOTAL_QUESTIONS})`}
          </p>
        </header>

        {step === 1 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Step 1: MBTI 선택
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              잘 모르겠다면 &lsquo;모름&rsquo;을 선택해도 됩니다. 사상체질 결과만
              먼저 확인할 수 있어요.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              본 검사는 의학적 진단이 아니며, 사용자의 자기선택을 기반으로 결과를
              조합합니다.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MBTI_ORDER.map((mbti) => {
                const isSelected = mbtiChoice === mbti;
                return (
                  <button
                    key={mbti}
                    type="button"
                    onClick={() => selectMbti(mbti)}
                    className={[
                      "rounded-xl border p-3 text-left transition",
                      isSelected
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 bg-white hover:bg-amber-50/40",
                    ].join(" ")}
                  >
                    <p className="text-sm font-bold text-slate-900">{mbti}</p>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => selectMbti("unknown")}
                className={[
                  "rounded-xl border p-3 text-left transition sm:col-span-2",
                  mbtiChoice === "unknown"
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 bg-white hover:bg-amber-50/40",
                ].join(" ")}
              >
                <p className="text-sm font-bold text-slate-900">모름</p>
                <p className="mt-1 text-xs text-slate-600">추정 없이 진행</p>
              </button>
            </div>

            <button
              type="button"
              onClick={handleStartSasang}
              disabled={!mbtiChoice}
              className={[
                "mt-5 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition sm:w-auto",
                mbtiChoice
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "cursor-not-allowed bg-amber-200 text-white",
              ].join(" ")}
            >
              사상체질 검사 시작
            </button>
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    질문 {sasangStep + 1}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">
                    {currentQuestion.question}
                  </p>
                </div>
                <div className="w-full sm:w-56">
                  <div className="w-full rounded-full bg-amber-100 p-1">
                    <div
                      className="h-2 rounded-full bg-amber-600 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    진행률 {sasangStep + 1} / {TOTAL_QUESTIONS} ({progressPercent}%)
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setAnswer("A")}
                  className={[
                    "min-h-[72px] whitespace-normal rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition",
                    chosen === "A"
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 bg-white hover:bg-amber-50/40",
                  ].join(" ")}
                >
                  <span className="font-semibold text-slate-900">A. </span>
                  {currentQuestion.optionA.label}
                </button>
                <button
                  type="button"
                  onClick={() => setAnswer("B")}
                  className={[
                    "min-h-[72px] whitespace-normal rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition",
                    chosen === "B"
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-200 bg-white hover:bg-amber-50/40",
                  ].join(" ")}
                >
                  <span className="font-semibold text-slate-900">B. </span>
                  {currentQuestion.optionB.label}
                </button>
              </div>

              <p className="mt-4 text-sm text-slate-600">
                선택한 답변은 다음/이전 문항 이동 시 유지됩니다.
              </p>
            </section>

            <section className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={sasangStep === 0}
                className={[
                  "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                  sasangStep === 0
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-amber-50",
                ].join(" ")}
              >
                이전
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!isAnswered}
                className={[
                  "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition",
                  isAnswered
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "cursor-not-allowed bg-amber-200 text-white",
                ].join(" ")}
              >
                {sasangStep === TOTAL_QUESTIONS - 1 ? "결과 보기" : "다음"}
              </button>
            </section>

            <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm leading-relaxed text-amber-900/90">
                본 검사는 자기이해와 재미를 위한 콘텐츠이며, 의학적 진단이
                아닙니다.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

