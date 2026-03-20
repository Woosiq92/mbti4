import type {
  AnswerMap,
  EvidenceMetric,
  EvidenceSummary,
  Question,
  SasangTypeId,
} from "../types";

const SANG_ORDER_TIE_BREAK: SasangTypeId[] = ["soyang", "taeum", "soeum", "taeyang"];

export function isCompleteTest(answers: AnswerMap, questions: Question[]): boolean {
  for (const q of questions) {
    const v = answers[q.id];
    if (v !== "A" && v !== "B") return false;
  }
  return true;
}

export function calculateSasang(
  answers: AnswerMap,
  questions: Question[]
): SasangTypeId {
  const scores: Record<SasangTypeId, number> = {
    taeyang: 0,
    taeum: 0,
    soyang: 0,
    soeum: 0,
  };

  for (const q of questions) {
    const chosen = answers[q.id];
    if (chosen !== "A" && chosen !== "B") continue;
    if (!q.sasangRule) continue;

    const contrib = chosen === "A" ? q.sasangRule.a : q.sasangRule.b;
    scores.taeyang += contrib.taeyang;
    scores.taeum += contrib.taeum;
    scores.soyang += contrib.soyang;
    scores.soeum += contrib.soeum;
  }

  const maxScore = Math.max(scores.taeyang, scores.taeum, scores.soyang, scores.soeum);
  const candidates = (Object.keys(scores) as SasangTypeId[]).filter(
    (k) => scores[k] === maxScore
  );

  // 동점이면 태양인(taeyang)은 희귀하게 나오도록, 우선순위를 뒤로 둡니다.
  for (const preferred of SANG_ORDER_TIE_BREAK) {
    if (candidates.includes(preferred)) return preferred;
  }

  return "taeyang";
}

export type PairKey = "AA" | "AB" | "BA" | "BB";
export type EvidenceAxisCount = "0" | "1" | "2" | "3";
// 공유 링크 evidence 재현용(각 축에서 A가 나온 횟수: 0~3)
export type EvidenceCode = `${EvidenceAxisCount}.${EvidenceAxisCount}.${EvidenceAxisCount}.${EvidenceAxisCount}`;

function pairPattern(answers: AnswerMap, id1: string, id2: string): PairKey | null {
  const a = answers[id1];
  const b = answers[id2];
  if (a !== "A" && a !== "B") return null;
  if (b !== "A" && b !== "B") return null;
  return `${a}${b}` as PairKey;
}

const EVIDENCE_FALLBACK =
  "이 문항 조합만으로는 한쪽으로 단정하기 어려워 보였어요. 아래 결과는 전체 응답을 종합해 가볍게 정리한 참고용입니다.";

const REACTION_SPEED_BY_KEY: Record<PairKey, string> = {
  AA: "새 일을 시작할 때 먼저 움직이는 편이고, 사람들과 있을 때도 반응과 표현이 비교적 직접적으로 보였어요.",
  BB: "충분히 생각한 뒤 움직이는 쪽에 가깝고, 반응과 표현도 조심스러운 흐름이 더 강했어요.",
  AB: "움직임은 빠르게 시작하는 편이지만, 표현은 조심스럽게 가져가는 경향이 함께 보였어요.",
  BA: "생각을 정리한 뒤 움직이는 편이면서도, 함께할 때는 비교적 바로 반응하는 모습도 있었어요.",
};

const ENERGY_DIRECTION_BY_KEY: Record<PairKey, string> = {
  AA: "에너지가 바깥으로 드러나기 쉬운 편에 가깝고, 전체 분위기도 가볍게 위로 뻗는 느낌으로 읽혔어요.",
  BB: "에너지를 안으로 쌓아 두는 편에 가깝고, 분위기도 묵직하게 안으로 모이는 쪽이 더 또렷했어요.",
  AB: "밖으로 드러내는 면과 조용히 쌓아 두는 면이 함께 있었고, 전체 흐름은 바깥으로 퍼지는 쪽에 조금 더 가까웠어요.",
  BA: "안으로 쌓는 편에 가깝게 응답한 부분이 있으면서도, 분위기는 위로 뻗는 인상이 함께 보였어요. 두 흐름이 섞인 패턴에 가깝습니다.",
};

const STRESS_PATTERN_BY_KEY: Record<PairKey, string> = {
  AA: "평소 컨디션에서 열감을 느끼기 쉬운 편으로 응답했고, 스트레스가 올라올 때도 예민함이나 답답함이 먼저 느껴질 수 있다고 본 답변이 많았어요.",
  BB: "몸을 따뜻하게 해야 편한 쪽에 가깝게 응답했고, 압박이 커질수록 기운이 떨어지거나 위축되는 흐름이 더 강하게 보였어요.",
  AB: "평소에는 열감이나 활발한 반응이 느껴지는 편인데, 스트레스 상황에서는 소진이나 위축이 먼저 올라온다고 느끼는 흐름이 함께 보였어요.",
  BA: "추위나 안정 쪽 컨디션에 가깝게 응답한 편이면서, 스트레스에서는 예민함이나 답답함이 먼저 느껴질 수 있다는 답도 함께 있었어요.",
};

const LIFE_RHYTHM_BY_KEY: Record<PairKey, string> = {
  AA: "활동량이 늘면 오히려 살아나는 편에 가깝게 응답했고, 생활 리듬도 빠르게 몰입하는 쪽으로 보였어요.",
  BB: "활동이 쌓이면 금방 지치기 쉽다고 느끼는 편에 가깝고, 일정하고 안정적인 흐름을 더 선호하는 쪽으로도 읽혔어요.",
  AB: "빠른 생활 리듬에 익숙한 면이 있으면서도, 활동이 겹치면 쉽게 무리가 쌓인다고 느끼는 흐름이 함께 있었어요.",
  BA: "몸은 빠른 몰입이 가능한 편으로 응답한 부분이 있지만, 장기적으로는 안정적인 루틴을 더 편하게 느끼는 경향도 보였어요.",
};

function buildEvidenceFromPairKeys(
  reactionSpeed: PairKey | null,
  energyDirection: PairKey | null,
  stressPattern: PairKey | null,
  lifeRhythm: PairKey | null
): EvidenceSummary {
  return {
    reactionSpeed: reactionSpeed ? REACTION_SPEED_BY_KEY[reactionSpeed] : EVIDENCE_FALLBACK,
    energyDirection: energyDirection ? ENERGY_DIRECTION_BY_KEY[energyDirection] : EVIDENCE_FALLBACK,
    stressPattern: stressPattern ? STRESS_PATTERN_BY_KEY[stressPattern] : EVIDENCE_FALLBACK,
    lifeRhythm: lifeRhythm ? LIFE_RHYTHM_BY_KEY[lifeRhythm] : EVIDENCE_FALLBACK,
  };
}

/**
 * 사상 8문항 응답(q1~q8)을 바탕으로 4축 근거 문장을 생성합니다.
 * 단정적 진단이 아니라 “경향이 보였어요” 톤을 유지합니다.
 */
export function buildEvidenceFromAnswers(answers: AnswerMap): EvidenceSummary {
  const metrics = buildEvidenceMetricsFromAnswers(answers);
  return {
    reactionSpeed: metrics[0].summary,
    energyDirection: metrics[1].summary,
    stressPattern: metrics[2].summary,
    lifeRhythm: metrics[3].summary,
  };
}

/**
 * 공유 링크에서 evidence를 재현하기 위한 “압축 코드”를 만듭니다.
 * (공유 시 sessionStorage 의존 없이 재현 가능)
 */
export function getEvidenceCodeFromAnswers(answers: AnswerMap): EvidenceCode | null {
  const countA = (ids: string[]) =>
    ids.reduce((acc, id) => acc + (answers[id] === "A" ? 1 : 0), 0);

  const reactionSpeed = countA(["q2", "q3", "q10"]);
  const energyDirection = countA(["q4", "q8", "q9"]);
  const stressPattern = countA(["q1", "q6", "q12"]);
  const lifeRhythm = countA(["q5", "q7", "q11"]);

  const digits = [reactionSpeed, energyDirection, stressPattern, lifeRhythm];
  if (digits.some((d) => d < 0 || d > 3)) return null;

  return `${digits[0]}.${digits[1]}.${digits[2]}.${digits[3]}` as EvidenceCode;
}

export function buildEvidenceFromCode(code: string): EvidenceSummary | null {
  const metrics = buildEvidenceMetricsFromCode(code);
  if (!metrics) return null;
  return {
    reactionSpeed: metrics[0].summary,
    energyDirection: metrics[1].summary,
    stressPattern: metrics[2].summary,
    lifeRhythm: metrics[3].summary,
  };
}

/**
 * 공유 링크 진입 시에는 사용자의 원문 답안이 없기 때문에,
 * 최종 조합(사상체질) 기반으로만 “경향”을 요약합니다.
 */
export function buildEvidenceFromCombination(sasang: SasangTypeId): EvidenceSummary {
  const metrics = buildEvidenceMetricsFromCombination(sasang);
  return {
    reactionSpeed: metrics[0].summary,
    energyDirection: metrics[1].summary,
    stressPattern: metrics[2].summary,
    lifeRhythm: metrics[3].summary,
  };
}

const AXIS_META: Record<
  | "reactionSpeed"
  | "energyDirection"
  | "stressPattern"
  | "lifeRhythm",
  {
    label: string;
    leftLabel: string;
    rightLabel: string;
  }
> = {
  reactionSpeed: {
    label: "반응 속도",
    leftLabel: "신중함",
    rightLabel: "빠른 반응",
  },
  energyDirection: {
    label: "에너지 방향",
    leftLabel: "안으로 축적",
    rightLabel: "바깥으로 발산",
  },
  stressPattern: {
    label: "스트레스 패턴",
    leftLabel: "소진·위축",
    rightLabel: "과열·예민",
  },
  lifeRhythm: {
    label: "생활 리듬",
    leftLabel: "안정적 흐름",
    rightLabel: "빠른 몰입",
  },
};

function normalizeEvidenceScoreFromRaw(raw: number, totalAbs: number): number {
  // raw: -totalAbs ~ +totalAbs
  // score: 0 ~ 100
  const score = ((raw + totalAbs) / (totalAbs * 2)) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function weightedPairScore(pair: PairKey, w1: number, w2: number): number {
  const c0 = pair[0];
  const c1 = pair[1];
  const raw =
    (c0 === "A" ? w1 : -w1) +
    (c1 === "A" ? w2 : -w2);
  return normalizeEvidenceScoreFromRaw(raw, w1 + w2);
}

function getMetricSummary(key: EvidenceMetric["key"], score: number): string {
  const midLeft = score < 50;
  const isLeft = score <= 40;
  const isRight = score >= 60;

  if (key === "reactionSpeed") {
    if (isLeft) return "빠르게 움직이기보다 생각을 정리한 뒤 반응하는 흐름이 조금 더 강했어요.";
    if (isRight) return "먼저 반응하고 움직이는 속도 쪽이 조금 더 강하게 나타났어요.";
    if (score === 50) return "빠른 반응성과 신중한 판단이 함께 보이는 중간형에 가까웠어요.";
    return midLeft
      ? "전반적으로는 생각을 정리한 뒤 반응하는 쪽이 조금 더 가까웠어요."
      : "전반적으로는 빠른 반응 쪽이 조금 더 가까웠어요.";
  }

  if (key === "energyDirection") {
    if (isLeft) return "에너지를 바깥으로 크게 드러내기보다 안으로 쌓고 유지하는 편에 가까웠어요.";
    if (isRight) return "에너지를 바깥으로 크게 드러내며 확장하는 편이 조금 더 강했어요.";
    if (score === 50) return "바깥으로 드러내는 면과 안으로 유지하는 면이 함께 나타나는 흐름에 가까웠어요.";
    return midLeft
      ? "안으로 축적하는 쪽이 조금 더 가까웠어요."
      : "바깥으로 발산하는 쪽이 조금 더 가까웠어요.";
  }

  if (key === "stressPattern") {
    if (isLeft) return "압박이 커질수록 예민하게 과열되기보다 기운이 떨어지고 위축되는 흐름이 조금 더 강했어요.";
    if (isRight) return "압박이 커질수록 예민함/열감이 먼저 올라오는 흐름이 조금 더 강했어요.";
    if (score === 50) return "스트레스 상황에서 과열과 소진이 함께 흔들리는 중간형에 가까웠어요.";
    return midLeft
      ? "소진·위축 쪽 경향이 조금 더 가까웠어요."
      : "과열·예민 쪽 경향이 조금 더 가까웠어요.";
  }

  // lifeRhythm
  if (isLeft) return "순간적인 속도감보다 일정하고 안정적인 리듬을 선호하는 경향이 보였어요.";
  if (isRight) return "활동량이 늘면 오히려 리듬이 살아나며 빠르게 몰입하는 편이 조금 더 강했어요.";
  if (score === 50) return "안정적인 리듬과 빠른 몰입이 함께 나타나는 중간형에 가까웠어요.";
  return midLeft
    ? "전반적으로는 안정적인 흐름을 더 편하게 느끼는 쪽이 조금 더 가까웠어요."
    : "전반적으로는 빠르게 몰입하는 쪽이 조금 더 가까웠어요.";
}

function buildEvidenceMetricsFromPairKeys(args: {
  reactionSpeed: PairKey | null;
  energyDirection: PairKey | null;
  stressPattern: PairKey | null;
  lifeRhythm: PairKey | null;
}): EvidenceMetric[] {
  const { reactionSpeed, energyDirection, stressPattern, lifeRhythm } = args;

  const reactionScore = reactionSpeed ? weightedPairScore(reactionSpeed, 30, 20) : 50;
  const energyScore = energyDirection ? weightedPairScore(energyDirection, 30, 20) : 50;
  const stressScore = stressPattern ? weightedPairScore(stressPattern, 30, 20) : 50;
  const rhythmScore = lifeRhythm ? weightedPairScore(lifeRhythm, 30, 20) : 50;

  const mk = (key: EvidenceMetric["key"], score: number): EvidenceMetric => {
    const meta = AXIS_META[key];
    return {
      key,
      label: meta.label,
      leftLabel: meta.leftLabel,
      rightLabel: meta.rightLabel,
      score,
      summary: getMetricSummary(key, score),
    };
  };

  return [
    mk("reactionSpeed", reactionScore),
    mk("energyDirection", energyScore),
    mk("stressPattern", stressScore),
    mk("lifeRhythm", rhythmScore),
  ];
}

/**
 * 사상체질 8문항 응답을 기반으로 4축(0~100) evidenceMetrics를 계산합니다.
 * 값은 “진단 수치”가 아니라, 이번 답변 흐름에서 상대적으로 더 강하게 나타난 경향 요약입니다.
 */
export function buildEvidenceMetricsFromAnswers(answers: AnswerMap): EvidenceMetric[] {
  const countA = (ids: string[]) =>
    ids.reduce((acc, id) => acc + (answers[id] === "A" ? 1 : 0), 0);

  const scoreFromCount = (countA: number) => {
    // mixed는 40~60대에서 “중간형” 느낌을 주도록 약간 압축합니다.
    if (countA <= 0) return 0;
    if (countA === 1) return 45;
    if (countA === 2) return 55;
    return 100;
  };

  const reactionSpeedCountA = countA(["q2", "q3", "q10"]);
  const energyDirectionCountA = countA(["q4", "q8", "q9"]);
  const stressPatternCountA = countA(["q1", "q6", "q12"]);
  const lifeRhythmCountA = countA(["q5", "q7", "q11"]);

  const mk = (key: EvidenceMetric["key"], count: number): EvidenceMetric => {
    const meta = AXIS_META[key];
    const score = scoreFromCount(count);
    return {
      key,
      label: meta.label,
      leftLabel: meta.leftLabel,
      rightLabel: meta.rightLabel,
      score,
      summary: getMetricSummary(key, score),
    };
  };

  return [
    mk("reactionSpeed", reactionSpeedCountA),
    mk("energyDirection", energyDirectionCountA),
    mk("stressPattern", stressPatternCountA),
    mk("lifeRhythm", lifeRhythmCountA),
  ];
}

export function buildEvidenceMetricsFromCode(code: string): EvidenceMetric[] | null {
  const parts = code.split(".");
  if (parts.length !== 4) return null;
  const digits = parts.map((p) => {
    if (p !== "0" && p !== "1" && p !== "2" && p !== "3") return -1;
    return Number(p);
  });

  if (digits.some((n) => n < 0)) return null;

  const scoreFromCount = (count: number) => {
    if (count <= 0) return 0;
    if (count === 1) return 45;
    if (count === 2) return 55;
    return 100;
  };

  const mk = (key: EvidenceMetric["key"], count: number): EvidenceMetric => {
    const meta = AXIS_META[key];
    const score = scoreFromCount(count);
    return {
      key,
      label: meta.label,
      leftLabel: meta.leftLabel,
      rightLabel: meta.rightLabel,
      score,
      summary: getMetricSummary(key, score),
    };
  };

  return [
    mk("reactionSpeed", digits[0]),
    mk("energyDirection", digits[1]),
    mk("stressPattern", digits[2]),
    mk("lifeRhythm", digits[3]),
  ];
}

/**
 * 공유 링크 진입 시에는 원문 답안이 없으므로, 조합(사상체질) 기반으로
 * “경향이 가까울 가능성”만 반영한 기본 evidenceMetrics를 생성합니다.
 */
export function buildEvidenceMetricsFromCombination(
  sasang: SasangTypeId
): EvidenceMetric[] {
  const countsBySasang: Record<
    SasangTypeId,
    {
      reactionSpeed: number; // q2/q3/q10에서 A가 나온 횟수(0~3)
      energyDirection: number; // q4/q8/q9에서 A가 나온 횟수(0~3)
      stressPattern: number; // q1/q6/q12에서 A가 나온 횟수(0~3)
      lifeRhythm: number; // q5/q7/q11에서 A가 나온 횟수(0~3)
    }
  > = {
    taeyang: { reactionSpeed: 2, energyDirection: 2, stressPattern: 2, lifeRhythm: 2 },
    taeum: { reactionSpeed: 1, energyDirection: 0, stressPattern: 1, lifeRhythm: 1 },
    soyang: { reactionSpeed: 2, energyDirection: 2, stressPattern: 2, lifeRhythm: 2 },
    soeum: { reactionSpeed: 1, energyDirection: 0, stressPattern: 0, lifeRhythm: 1 },
  };

  const scoreFromCount = (count: number) => {
    if (count <= 0) return 0;
    if (count === 1) return 45;
    if (count === 2) return 55;
    return 100;
  };

  const counts = countsBySasang[sasang];
  const mk = (key: EvidenceMetric["key"], count: number): EvidenceMetric => {
    const meta = AXIS_META[key];
    const score = scoreFromCount(count);
    return {
      key,
      label: meta.label,
      leftLabel: meta.leftLabel,
      rightLabel: meta.rightLabel,
      score,
      summary: getMetricSummary(key, score),
    };
  };

  return [
    mk("reactionSpeed", counts.reactionSpeed),
    mk("energyDirection", counts.energyDirection),
    mk("stressPattern", counts.stressPattern),
    mk("lifeRhythm", counts.lifeRhythm),
  ];
}


