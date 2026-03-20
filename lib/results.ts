import type { AnswerMap, MbtiChoice, MbtiType, SasangTypeId, TestResult } from "../types";
import { mbtiData, unknownMbtiData, type MbtiDataEntry } from "./mbti-data";
import { mbtiLoveStyle, unknownMbtiLoveStyle } from "./mbti-love-style";
import { DISCLAIMER, RESULT_CARD_OVERRIDES } from "./result-names";
import { SASANG_META } from "./sasang-data";
import {
  buildEvidenceFromAnswers,
  buildEvidenceFromCode,
  buildEvidenceFromCombination,
  buildEvidenceMetricsFromAnswers,
  buildEvidenceMetricsFromCode,
  buildEvidenceMetricsFromCombination,
} from "./scoring";
import { MBTI_ORDER } from "./ui-mbti";

type MbtiNaming = {
  role: string;
  tone: string;
};

const mbtiNaming: Record<string, MbtiNaming> = {
  INTJ: { role: "설계자", tone: "전략" },
  INTP: { role: "탐구자", tone: "분석" },
  ENTJ: { role: "지휘관", tone: "확장" },
  ENTP: { role: "개척자", tone: "발상" },
  INFJ: { role: "조율자", tone: "통찰" },
  INFP: { role: "해석자", tone: "내면" },
  ENFJ: { role: "동기부여가", tone: "관계" },
  ENFP: { role: "영감가", tone: "영감" },
  ISTJ: { role: "관리자", tone: "원칙" },
  ISFJ: { role: "수호자", tone: "배려" },
  ESTJ: { role: "운영가", tone: "구조" },
  ESFJ: { role: "조정자", tone: "조화" },
  ISTP: { role: "해결사", tone: "실전" },
  ISFP: { role: "창작자", tone: "감각" },
  ESTP: { role: "플레이어", tone: "직진" },
  ESFP: { role: "메이커", tone: "현장" },
};

const sasangNaming: Record<
  SasangTypeId,
  {
    primaryPrefix: string;
    altPrefixes: string[];
    vibe: string;
  }
> = {
  taeyang: {
    primaryPrefix: "돌파형",
    altPrefixes: ["확장형", "비전형", "강한 발현의"],
    vibe: "위로 뻗는 추진력",
  },
  taeum: {
    primaryPrefix: "축적형",
    altPrefixes: ["안정형", "기반형", "묵직한"],
    vibe: "묵직한 안정감과 지속성",
  },
  soyang: {
    primaryPrefix: "확산형",
    altPrefixes: ["에너지형", "직진형", "빠른 반응의"],
    vibe: "빠른 반응과 표현력",
  },
  soeum: {
    primaryPrefix: "내면형",
    altPrefixes: ["섬세한", "고요한", "집중형"],
    vibe: "신중함과 내적 안정",
  },
};

function getCombinationKey(mbti: MbtiChoice, sasang: SasangTypeId): string {
  return `${String(mbti).trim()}|${String(sasang).trim()}`;
}

function getMbtiNaming(mbtiChoice: MbtiChoice): MbtiNaming | null {
  if (mbtiChoice === "unknown") return null;
  return mbtiNaming[mbtiChoice] ?? null;
}

function getSasangNaming(sasang: SasangTypeId) {
  return sasangNaming[sasang];
}

function chooseSasangPrefixForGeneratedTitle(args: {
  sasang: SasangTypeId;
  mbtiTone: string;
  mbtiRole: string;
}): string {
  const { sasang, mbtiTone, mbtiRole } = args;
  const s = getSasangNaming(sasang);

  // "너무 기계적인 조합"을 줄이기 위한 간단한 보정 규칙
  if (sasang === "soeum") {
    if (mbtiTone === "분석" || mbtiTone === "내면") return "고요한";
    if (mbtiTone === "관계") return "섬세한";
    if (mbtiTone === "감각" || mbtiTone === "배려") return "섬세한";
    return s.primaryPrefix; // 내면형
  }

  if (sasang === "taeum") {
    if (mbtiRole === "메이커") return "안정형"; // "축적형 메이커"보다 자연스러운 편
    return s.primaryPrefix; // 축적형
  }

  if (sasang === "soyang") {
    if (mbtiTone === "직진" || mbtiRole === "플레이어") return "직진형";
    if (mbtiTone === "실전") return "에너지형";
    return s.primaryPrefix; // 확산형
  }

  // taeyang
  if (sasang === "taeyang") {
    if (mbtiTone === "전략" || mbtiTone === "발상" || mbtiTone === "영감") return "비전형";
    return s.primaryPrefix; // 돌파형
  }

  return s.primaryPrefix;
}

function generateResultTitle(mbtiChoice: MbtiChoice, sasang: SasangTypeId): string {
  if (mbtiChoice === "unknown") {
    return "나를 더 알아보는 관점 탐색자";
  }

  const mbti = getMbtiNaming(mbtiChoice);
  if (!mbti) return "나를 더 알아보는 관점 탐색자";

  const { role, tone } = mbti;
  const sasangPrefix = chooseSasangPrefixForGeneratedTitle({
    sasang,
    mbtiTone: tone,
    mbtiRole: role,
  });

  // 요청된 보정/예시 톤을 반영한 특수 템플릿(과도한 하드코딩은 피하고, 역할/톤 기반으로 최소만)
  if (role === "조율자" && tone === "통찰" && sasang === "soeum") {
    return "깊은 통찰의 조율자";
  }

  if (role === "동기부여가") {
    // "내면형 동기부여가" 같은 어색함을 피하기 위해 톤 단어(관계)를 함께 사용
    return `${sasangPrefix} ${tone} ${role}`;
  }

  if (role === "탐구자" && tone === "분석" && sasang === "soeum") {
    // "고요한 분석 탐구자"처럼 분석 톤이 살아나게
    return `${sasangPrefix} 분석 ${role}`;
  }

  if (role === "관리자" && tone === "원칙") {
    // "축적형 원칙 관리자" 같은 자연스러운 연결
    return `${sasangPrefix} 원칙 ${role}`;
  }

  if (role === "설계자" && tone === "전략" && sasang === "taeyang") {
    // "냉철한 비전형 설계자" 톤
    return `냉철한 ${sasangPrefix} ${role}`;
  }

  if (role === "플레이어" && sasang === "soyang") {
    // 직진형 플레이어는 '현실' 단어를 붙이면 소개처럼 자연스러움
    return `${sasangPrefix} 현실 ${role}`;
  }

  return `${sasangPrefix} ${role}`;
}

function getResultTitle(mbtiChoice: MbtiChoice, sasang: SasangTypeId): string {
  const combinationKey = getCombinationKey(mbtiChoice, sasang);
  const customTitle = getCustomResultTitle(combinationKey);
  if (customTitle) return customTitle;
  return generateResultTitle(mbtiChoice, sasang);
}

function getCustomResultTitle(combinationKey: string): string | null {
  const card = RESULT_CARD_OVERRIDES[combinationKey];
  return card?.resultTitle ?? null;
}

/**
 * 개발/검증용: 64개 조합의 결과명을 만들어 확인할 수 있는 헬퍼
 */
export function getAllCombinationTitles(): Array<{
  combinationKey: string;
  title: string;
}> {
  const sasangKeys = Object.keys(SASangMetaToIds()) as SasangTypeId[];
  const out: Array<{ combinationKey: string; title: string }> = [];
  for (const mbti of MBTI_ORDER) {
    for (const sasang of sasangKeys) {
      const key = getCombinationKey(mbti, sasang);
      out.push({ combinationKey: key, title: getResultTitle(mbti, sasang) });
    }
  }
  return out;
}

function SASangMetaToIds(): Record<SasangTypeId, unknown> {
  // SASANG_META는 타입만으로도 충분하지만, 런타임에서도 id 키를 뽑기 위해 사용
  return SASANG_META as unknown as Record<SasangTypeId, unknown>;
}

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

function toSoftTypePyeonida(text: string): string {
  // MBTI 데이터의 "유형입니다" 같은 마무리를 브랜드 톤(편입니다)으로 맞춥니다.
  return text.replace(/유형입니다[.!?]?$/, "편입니다.");
}

function buildGeneratedSummary(
  mbtiChoice: MbtiChoice,
  sasang: SasangTypeId
): string {
  const mbtiEntry = getMbtiEntry(mbtiChoice);
  const sasangMeta = SASANG_META[sasang];

  const strengthSentence = toSoftTypePyeonida(firstSentence(mbtiEntry.summary));
  const rhythmBase = sasangMeta.sasangSummary.replace(/성향\s*$/, "").trim();

  return `${strengthSentence} ${rhythmBase}에 가까운 생활 리듬이 함께 보이는 편입니다.`;
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
  const combinationKey = getCombinationKey(mbtiChoice, sasang);
  const card = RESULT_CARD_OVERRIDES[combinationKey];

  const coreFeatures = [
    mbtiEntry.traits[0],
    mbtiEntry.traits[1],
    sasangMeta.traits[0],
    sasangMeta.traits[1],
  ];

  const resultTitle = getResultTitle(mbtiChoice, sasang);

  const summary = card?.summary ?? buildGeneratedSummary(mbtiChoice, sasang);
  const traits = card?.traits ?? defaultTraitsFromCore(coreFeatures);

  const oneLine = `${mbtiEntry.summary} 사상체질(${sasangMeta.name}) 관점에서는 ${sasangMeta.sasangSummary}이(가) 함께 얹혀 보일 수 있습니다.`;

  const relationshipStyle = `${mbtiEntry.relationshipStyle} 또한 ${sasangMeta.relationshipStyle}`;
  // 1문장 + 1문장 구조로 문체를 통일합니다.
  const studyWorkStyle = `${mbtiEntry.workStyle} ${sasangMeta.studyWorkStyle}`;
  const stressResponse = `${mbtiEntry.stressStyle} ${sasangMeta.stressResponse}`;
  const recoveryTip = `${mbtiEntry.growthTip} ${sasangMeta.recoveryTip}`;
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
