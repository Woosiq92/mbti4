import type { AnswerMap, MbtiChoice, MbtiType, SasangTypeId, TestResult } from "../types";
import { mbtiData, unknownMbtiData, type MbtiDataEntry } from "./mbti-data";
import { mbtiLoveStyle, unknownMbtiLoveStyle } from "./mbti-love-style";
import { DISCLAIMER, RESULT_CARD_OVERRIDES, resultOverrideKey } from "./result-names";
import { SASANG_META } from "./sasang-data";
import {
  buildEvidenceFromAnswers,
  buildEvidenceFromCode,
  buildEvidenceFromCombination,
  buildEvidenceMetricsFromAnswers,
  buildEvidenceMetricsFromCode,
  buildEvidenceMetricsFromCombination,
} from "./scoring";

function getMbtiEntry(mbtiChoice: MbtiChoice): MbtiDataEntry {
  if (mbtiChoice === "unknown") return unknownMbtiData;
  const entry = mbtiData[mbtiChoice as MbtiType];
  return entry ?? unknownMbtiData;
}

function getLoveStyleLine(mbtiChoice: MbtiChoice): string {
  if (mbtiChoice === "unknown") return unknownMbtiLoveStyle;
  const line = mbtiLoveStyle[mbtiChoice as MbtiType];
  return line ?? unknownMbtiLoveStyle;
}

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]?/);
  return (m?.[0] ?? text).trim();
}

function defaultTraitsFromCore(core: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of core) {
    const s = t.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= 4) break;
  }
  return out;
}

function buildResultBase(
  mbtiChoice: MbtiChoice,
  sasang: SasangTypeId,
  evidence: ReturnType<typeof buildEvidenceFromAnswers>,
  evidenceMetrics: ReturnType<typeof buildEvidenceMetricsFromAnswers>,
  evidenceMode: "answers" | "combination" | "code"
): TestResult {
  const mbtiEntry = getMbtiEntry(mbtiChoice);
  const sasangMeta = SASANG_META[sasang];

  const mbtiLabel =
    mbtiChoice === "unknown"
      ? "모름"
      : mbtiData[mbtiChoice as MbtiType]
        ? mbtiChoice
        : "모름";

  const resultMeta = `${mbtiLabel} × ${sasangMeta.name}`;
  const overrideKey = resultOverrideKey(mbtiChoice, sasang);
  const card = RESULT_CARD_OVERRIDES[overrideKey];

  const coreFeatures = [
    mbtiEntry.traits[0],
    mbtiEntry.traits[1],
    sasangMeta.traits[0],
    sasangMeta.traits[1],
  ];

  const resultTitle =
    card?.resultTitle ?? `${mbtiEntry.label} ${sasangMeta.name}`;

  const summary = card?.summary ?? firstSentence(mbtiEntry.summary);
  const traits = card?.traits ?? defaultTraitsFromCore(coreFeatures);

  const oneLine = `${mbtiEntry.summary} 사상체질(${sasangMeta.name}) 관점에서는 ${sasangMeta.sasangSummary}이(가) 함께 얹혀 보일 수 있습니다.`;

  const relationshipStyle = `${mbtiEntry.relationshipStyle} 또한 ${sasangMeta.relationshipStyle}`;
  const studyWorkStyle = `${mbtiEntry.workStyle} 또한 ${sasangMeta.studyWorkStyle}`;
  const stressResponse = `${mbtiEntry.stressStyle} 또한 ${sasangMeta.stressResponse}`;
  const recoveryTip = `${mbtiEntry.growthTip} 또한 ${sasangMeta.recoveryTip}`;
  const loveStyle = getLoveStyleLine(mbtiChoice);

  const evidenceHeader =
    evidenceMode === "answers"
      ? "── 응답에서 보인 경향 ──"
      : evidenceMode === "code"
        ? "── 공유 코드 기반 요약 ──"
        : "── 조합 기반 요약 ──";

  const copyText = [
    "MBTI × 사상체질 연구소 결과",
    "",
    `조합: ${resultMeta}`,
    `메인 결과명: ${resultTitle}`,
    `한 줄 요약: ${summary}`,
    `핵심 키워드: ${traits.join(", ")}`,
    "",
    `선택한 MBTI: ${mbtiLabel}`,
    `사상체질 결과: ${sasangMeta.name}`,
    "",
    evidenceHeader,
    `[반응 속도] ${evidence.reactionSpeed}`,
    `[에너지 방향] ${evidence.energyDirection}`,
    `[스트레스 패턴] ${evidence.stressPattern}`,
    `[생활 리듬] ${evidence.lifeRhythm}`,
    "",
    `상세 한 줄: ${oneLine}`,
    "",
    "핵심 특징(4):",
    `- ${coreFeatures[0]}`,
    `- ${coreFeatures[1]}`,
    `- ${coreFeatures[2]}`,
    `- ${coreFeatures[3]}`,
    "",
    `연애 스타일: ${loveStyle}`,
    "",
    `공부/일 스타일: ${studyWorkStyle}`,
    `스트레스 반응: ${stressResponse}`,
    `보완 포인트: ${recoveryTip}`,
    "",
    DISCLAIMER,
  ].join("\n");

  return {
    resultMeta,
    resultTitle,
    resultName: resultTitle,
    summary,
    oneLine,
    traits,
    coreFeatures,
    mbtiChoice,
    mbtiLabel,
    sasang,
    sasangLabel: sasangMeta.name,
    relationshipStyle,
    studyWorkStyle,
    stressResponse,
    recoveryTip,
    loveStyle,
    evidence,
    evidenceMetrics,
    copyText,
  };
}

/**
 * 공유 링크 진입(답안 없음)에도 동작하는 순수 생성 함수
 */
export function buildResultFromCombination(
  mbtiChoice: MbtiChoice,
  sasang: SasangTypeId
): TestResult {
  const evidence = buildEvidenceFromCombination(sasang);
  const evidenceMetrics = buildEvidenceMetricsFromCombination(sasang);
  return buildResultBase(
    mbtiChoice,
    sasang,
    evidence,
    evidenceMetrics,
    "combination"
  );
}

/**
 * 내부 테스트(답안 있음)에서는 응답 패턴 기반 evidence를 우선 사용
 */
export function buildResultFromAnswers(
  mbtiChoice: MbtiChoice,
  sasang: SasangTypeId,
  sasangAnswers: AnswerMap
): TestResult {
  const evidence = buildEvidenceFromAnswers(sasangAnswers);
  const evidenceMetrics = buildEvidenceMetricsFromAnswers(sasangAnswers);
  return buildResultBase(mbtiChoice, sasang, evidence, evidenceMetrics, "answers");
}

export function getResultByCombination(
  mbtiChoice: MbtiChoice,
  sasang: SasangTypeId,
  sasangAnswers?: AnswerMap,
  evidenceCode?: string | null
): TestResult {
  if (evidenceCode) {
    const evidence = buildEvidenceFromCode(evidenceCode);
    const evidenceMetrics = buildEvidenceMetricsFromCode(evidenceCode);
    if (evidence && evidenceMetrics) {
      return buildResultBase(mbtiChoice, sasang, evidence, evidenceMetrics, "code");
    }
  }

  if (sasangAnswers) return buildResultFromAnswers(mbtiChoice, sasang, sasangAnswers);
  return buildResultFromCombination(mbtiChoice, sasang);
}

// 하위 호환
export function buildHybridResult(
  mbtiChoice: MbtiChoice,
  sasang: SasangTypeId,
  sasangAnswers: AnswerMap
): TestResult {
  return buildResultFromAnswers(mbtiChoice, sasang, sasangAnswers);
}
