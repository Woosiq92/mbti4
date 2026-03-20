import type { MbtiChoice, SasangTypeId } from "../types";

/** 조합별 메인 결과 카드 카피 (대표 케이스) */
export type ResultCardOverride = {
  resultTitle: string;
  summary: string;
  /** pill/chip용 3~4개 권장 */
  traits: string[];
};

export const RESULT_CARD_OVERRIDES: Partial<Record<string, ResultCardOverride>> = {
  "INFP|soeum": {
    resultTitle: "조용한 내면형 해석자",
    summary: "깊은 감정과 섬세한 리듬 속에서 자기 페이스가 단단해지는 편입니다.",
    traits: ["섬세함", "깊은 몰입", "조용한 진심", "안정 지향"],
  },
  "ENFP|soyang": {
    resultTitle: "불꽃 확산형 영감가",
    summary:
      "사람과 아이디어의 흐름이 살아나면 에너지가 크게 회복되는 편입니다. 리듬은 빠르게 확장되는 쪽에 가까운 편입니다.",
    traits: ["열정", "영감", "확산", "가능성"],
  },
  "ISTJ|taeum": {
    resultTitle: "축적형 원칙 관리자",
    summary:
      "안정감과 지속성을 바탕으로 묵직하게 기준을 쌓아가는 편입니다. 한 번 잡힌 리듬이 오래 이어지려는 경향이 있습니다.",
    traits: ["원칙", "지속성", "책임감", "묵직함"],
  },
  "ENTP|taeyang": {
    resultTitle: "돌파형 비전 개척자",
    summary:
      "새로운 가능성을 보면 생각이 먼저 달아오르고 움직임이 이어지는 편입니다. 확장과 발현이 빠르게 살아나는 추진형 리듬에 가깝습니다.",
    traits: ["비전", "돌파", "아이디어", "전개력"],
  },
};

export function resultOverrideKey(mbti: MbtiChoice, sasang: SasangTypeId): string {
  return `${mbti}|${sasang}`;
}

export const DISCLAIMER =
  "본 테스트는 자기이해와 재미를 위한 콘텐츠입니다. 의학적 진단, 심리 평가, 전문 상담을 대체하지 않습니다.";
