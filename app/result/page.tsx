"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { AnswerMap, TestResult } from "../../types";
import { QUESTIONS } from "../../lib/questions";
import { isCompleteTest } from "../../lib/scoring";
import { getResultByCombination } from "../../lib/results";
import { DISCLAIMER } from "../../lib/result-names";
import { parseMbtiChoiceFromStorage } from "../../lib/ui-mbti";
import { parseSasangTypeIdFromName } from "../../lib/sasang-data";

const KEY_SASANG_ANSWERS = "sasangAnswers";

type CopyStatus = "idle" | "result-copied" | "link-copied" | "shared" | "error";

function ResultPageInner() {
  const searchParams = useSearchParams();

  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const mbtiParam = searchParams.get("mbti");
  const sasangParam = searchParams.get("sasang");
  const evidenceCodeParam = searchParams.get("code");

  const mbtiChoice = useMemo(() => parseMbtiChoiceFromStorage(mbtiParam), [mbtiParam]);
  const sasang = useMemo(
    () => parseSasangTypeIdFromName(sasangParam),
    [sasangParam]
  );

  useEffect(() => {
    try {
      if (!mbtiChoice || !sasang) {
        setInvalid(true);
        setReady(true);
        return;
      }

      let built: TestResult;
      const rawSasangAnswers = sessionStorage.getItem(KEY_SASANG_ANSWERS);
      if (rawSasangAnswers) {
        try {
          const parsed = JSON.parse(rawSasangAnswers) as AnswerMap;
          if (isCompleteTest(parsed, QUESTIONS)) {
            built = getResultByCombination(
              mbtiChoice,
              sasang,
              parsed,
              evidenceCodeParam
            );
            setResult(built);
            setReady(true);
            return;
          }
        } catch {
          // ignore and fallback
        }
      }

      built = getResultByCombination(mbtiChoice, sasang, undefined, evidenceCodeParam);
      setResult(built);
      setReady(true);
    } catch {
      setInvalid(true);
      setReady(true);
    }
  }, [mbtiChoice, sasang, evidenceCodeParam]);

  const handleCopyResult = async () => {
    if (!result) return;
    setCopyStatus("idle");
    try {
      const origin = window.location.origin;
      const shareUrl = `${origin}/result?mbti=${encodeURIComponent(
        result.mbtiChoice
      )}&sasang=${encodeURIComponent(result.sasangLabel)}`;

      const keywordsText = result.traits.map((t) => `- ${t}`).join("\n");
      const shareText = [
        result.resultTitle,
        `${result.mbtiLabel} × ${result.sasangLabel}`,
        "",
        result.summary,
        "",
        "핵심 키워드:",
        keywordsText,
        "",
        "내 결과 보기:",
        shareUrl,
      ].join("\n");

      await navigator.clipboard.writeText(shareText);
      setCopyStatus("result-copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const handleCopyShareLink = async () => {
    if (!result) return;
    setCopyStatus("idle");
    try {
      const origin = window.location.origin;
      const shareUrl = `${origin}/result?mbti=${encodeURIComponent(
        result.mbtiChoice
      )}&sasang=${encodeURIComponent(result.sasangLabel)}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("link-copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!result) return;
    const origin = window.location.origin;
    const shareUrl = `${origin}/result?mbti=${encodeURIComponent(
      result.mbtiChoice
    )}&sasang=${encodeURIComponent(result.sasangLabel)}`;
    const shortText = `${result.mbtiLabel} × ${result.sasangLabel} · ${result.summary}`;

    // share API 미지원이면 링크 복사로 fallback
    if (!navigator.share) {
      await handleCopyShareLink();
      return;
    }

    try {
      await navigator.share({
        title: result.resultTitle,
        text: shortText,
        url: shareUrl,
      });
      setCopyStatus("shared");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err: any) {
      // 공유 취소는 조용히 무시
      if (err?.name === "AbortError") return;
      // 실패해도 끝내지 말고 링크 복사 fallback
      await handleCopyShareLink();
    }
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-2xl px-4 pb-12 pt-10">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-600">결과를 불러오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  if (invalid || !result) {
    return (
      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
          <p className="text-center text-xs font-medium tracking-wide text-neutral-500 sm:text-left">
            MBTI × 사상체질 연구소
          </p>
          <section className="mt-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-bold text-neutral-900">
              결과 정보를 찾을 수 없습니다.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              테스트를 다시 진행해 주세요.
            </p>
            <div className="mt-4">
              <Link
                href="/test?reset=1"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                테스트 하러 가기
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <p className="text-center text-xs font-medium tracking-wide text-neutral-500 sm:text-left">
          MBTI × 사상체질 연구소
        </p>

        {/* 메인 결과 카드 */}
        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-neutral-400 sm:text-left">
            {result.resultMeta}
          </p>

          <h1 className="mt-4 text-balance text-center text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-left sm:text-4xl md:text-5xl">
            {result.resultTitle}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-neutral-600 sm:mx-0 sm:text-left sm:text-lg">
            {result.summary}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:justify-start">
            {result.traits.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-800"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-1 sm:items-stretch sm:justify-between">
              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex h-12 col-span-2 items-center justify-center rounded-2xl bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:col-span-1 sm:flex-1"
              >
                공유하기
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex h-12 col-span-2 items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 sm:col-span-1 sm:flex-1"
              >
                공유 링크 복사
              </button>

              <button
                type="button"
                onClick={handleCopyResult}
                className="inline-flex h-12 col-span-2 items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 sm:col-span-2"
              >
                결과 문구 복사
              </button>

              <Link
                href="/test?reset=1"
                className="inline-flex h-12 col-span-2 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 sm:col-span-2"
              >
                다시 테스트하기
              </Link>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-neutral-500 sm:text-left">
            이 링크를 보내면 같은 결과를 바로 볼 수 있어요. 친구에게 보내고 같이 비교해보세요.
          </p>

          {copyStatus === "result-copied" ? (
            <p className="mt-4 text-center text-sm font-medium text-emerald-700 sm:text-left">
              결과 문구가 복사되었어요.
            </p>
          ) : null}
          {copyStatus === "link-copied" ? (
            <p className="mt-4 text-center text-sm font-medium text-emerald-700 sm:text-left">
              공유 링크가 복사되었어요.
            </p>
          ) : null}
          {copyStatus === "shared" ? (
            <p className="mt-4 text-center text-sm font-medium text-emerald-700 sm:text-left">
              공유 창을 열었어요.
            </p>
          ) : null}
          {copyStatus === "error" ? (
            <p className="mt-4 text-center text-sm font-medium text-rose-700 sm:text-left">
              복사에 실패했습니다. 브라우저 권한을 확인해 주세요.
            </p>
          ) : null}
        </section>

        {/* 응답 경향 시각화 */}
        <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
            응답 경향 시각화
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
            아래 값은 진단 수치가 아니라, 이번 응답에서 상대적으로 더
            강하게 나타난 경향을 보기 쉽게 요약한 것입니다.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {result.evidenceMetrics.map((m) => (
              <div
                key={m.key}
                className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {m.label}
                </h3>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>{m.leftLabel}</span>
                    <span>{m.rightLabel}</span>
                  </div>

                  <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-neutral-900/15"
                      style={{ width: `${m.score}%` }}
                    />

                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-neutral-900 ring-2 ring-neutral-50"
                      style={{ left: `${m.score}%` }}
                    />
                  </div>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                  {m.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 상세 해석 */}
        <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-base font-semibold text-neutral-900">연애 스타일</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
            {result.loveStyle}
          </p>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-neutral-900">공부/일 스타일</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {result.studyWorkStyle}
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-neutral-900">스트레스 반응</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {result.stressResponse}
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:col-span-2">
            <h2 className="text-base font-semibold text-neutral-900">보완 포인트</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {result.recoveryTip}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-neutral-600">{DISCLAIMER}</p>
        </section>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-neutral-50">
          <div className="mx-auto max-w-2xl px-4 pb-12 pt-10">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-600">결과를 불러오는 중...</p>
            </div>
          </div>
        </main>
      }
    >
      <ResultPageInner />
    </Suspense>
  );
}
