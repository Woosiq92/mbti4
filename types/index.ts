export type OptionKey = "A" | "B";

export type MbtiAxis = "EI" | "SN" | "TF" | "JP";
export type MbtiSide = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MbtiType =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP";

export type MbtiChoice = MbtiType | "unknown";

export type SasangTypeId = "taeyang" | "taeum" | "soyang" | "soeum";

export interface AnswerMap {
  [questionId: string]: OptionKey | undefined;
}

export interface QuestionOption {
  label: string;
}

export interface MbtiQuestionRule {
  axis: MbtiAxis;
  aScore: MbtiSide;
  bScore: MbtiSide;
}

export interface SasangContribution {
  taeyang: number;
  taeum: number;
  soyang: number;
  soeum: number;
}

export interface SasangQuestionRule {
  a: SasangContribution;
  b: SasangContribution;
}

export interface Question {
  id: string;
  category: "sasang";
  /** 문항 질문 텍스트 */
  question: string;
  optionA: QuestionOption;
  optionB: QuestionOption;
  sasangRule?: SasangQuestionRule;
  /** (선택) 어떤 축/해석에 더 가까운지 참고용 태그 */
  metricTags?: string[];
}

/** 사상 12문항 응답 패턴 기반 요약 근거(진단 아님, 경향 설명) */
export interface EvidenceSummary {
  reactionSpeed: string;
  energyDirection: string;
  stressPattern: string;
  lifeRhythm: string;
}

export type EvidenceMetricKey =
  | "reactionSpeed"
  | "energyDirection"
  | "stressPattern"
  | "lifeRhythm";

export type EvidenceMetric = {
  key: EvidenceMetricKey;
  label: string;
  leftLabel: string;
  rightLabel: string;
  score: number; // 0~100
  summary: string;
};

export interface TestResult {
  /** 보조: "INFP × 소음인" */
  resultMeta: string;
  /** 메인 헤드라인 (정체성) */
  resultTitle: string;
  /** resultName은 resultTitle과 동일 (복사·호환) */
  resultName: string;
  /** 카드 중앙 한 줄 몰입 문장 */
  summary: string;
  /** 상세 조합 설명 (복사·심층) */
  oneLine: string;
  /** pill/chip 키워드 3~4개 */
  traits: string[];
  /** MBTI 두 축 + 사상 두 특성 (데이터 보존) */
  coreFeatures: string[];
  mbtiChoice: MbtiChoice;
  mbtiLabel: string;
  sasang: SasangTypeId;
  sasangLabel: string;
  relationshipStyle: string;
  studyWorkStyle: string;
  stressResponse: string;
  recoveryTip: string;
  loveStyle: string;
  /** 응답 기반 왜 이런 결과인지 설명 (4축) */
  evidence: EvidenceSummary;
  /** 막대 시각화용 응답 경향 요약(4축) */
  evidenceMetrics: EvidenceMetric[];
  copyText: string;
}
