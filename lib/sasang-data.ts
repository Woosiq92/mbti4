import type { SasangTypeId } from "../types";



export type SasangMeta = {

  name: string;

  sasangSummary: string;

  traits: [string, string];

  relationshipStyle: string;

  studyWorkStyle: string;

  stressResponse: string;

  recoveryTip: string;

};



/** 사상체질 4유형 설명·특성 메타 */

export const SASANG_META: Record<SasangTypeId, SasangMeta> = {

  taeyang: {

    name: "태양인",

    sasangSummary: "확장과 발현이 빠르게 살아나는 추진형 성향",

    traits: ["강한 발현력", "확장성"],

    relationshipStyle: "관계에서 먼저 움직이고 방향을 제안하는 편입니다.",

    studyWorkStyle: "작게 시작해 빨리 확장하며, 결과가 보이면 더 속도가 붙습니다.",

    stressResponse: "긴장이 올라오면 예민해지거나 열이 올라오는 느낌이 커질 수 있습니다.",

    recoveryTip:
      "짧고 명확한 목표로 속도를 정리하고, 즉시 휴식 루틴을 함께 두는 편이 도움이 됩니다.",

  },

  taeum: {

    name: "태음인",

    sasangSummary: "묵직하게 축적하며 안정감을 유지하는 축적형 성향",

    traits: ["지속적 안정감", "축적형 리듬"],

    relationshipStyle: "신뢰를 기반으로 오래 가고, 책임 있게 자리를 지키는 편입니다.",

    studyWorkStyle: "원리와 체계를 잡고 반복하면 실력이 단단해집니다.",

    stressResponse: "변동이 계속되면 에너지가 느리게 빠져나가며 무기력해질 수 있어요.",

    recoveryTip:
      "루틴을 회복하고, ‘한 번 더’가 아닌 ‘제대로’만 맞춰서 회복하는 쪽이 도움이 됩니다.",

  },

  soyang: {

    name: "소양인",

    sasangSummary: "빠른 반응과 표현으로 에너지를 퍼뜨리는 열정형 성향",

    traits: ["빠른 반응", "표현력 있는 에너지"],

    relationshipStyle: "대화의 흐름을 살리고, 감정과 제안을 빠르게 전달합니다.",

    studyWorkStyle: "아이디어를 바로 실행해보고, 피드백으로 배우는 방식이 잘 맞습니다.",

    stressResponse: "스트레스가 쌓이면 예민함/열감이 먼저 올라올 수 있습니다.",

    recoveryTip: "몸을 움직이거나 리듬 있는 활동으로 긴장을 풀어주는 게 도움이 됩니다.",

  },

  soeum: {

    name: "소음인",

    sasangSummary: "섬세함과 내적 안정 중심으로 회복하는 신중형 성향",

    traits: ["섬세한 감각", "예민한 회복 리듬"],

    relationshipStyle: "겉은 조용해도 상대의 온도를 깊게 읽고, 신중하게 관계를 단단히 만듭니다.",

    studyWorkStyle: "깊이 이해한 뒤 나만의 페이스로 정리할 때 학습 효과가 커집니다.",

    stressResponse: "압박이 길어지면 기운이 빠지고 생각이 깊어지며 위축될 수 있어요.",

    recoveryTip:
      "조용한 환경에서 정리 시간을 확보하고, 회복 신호에 먼저 귀 기울이는 편이 도움이 됩니다.",

  },

};



/** 랜딩·소개용 짧은 카드 설명 */

export const SASANG_LANDING_CARDS: Array<{

  id: SasangTypeId;

  title: string;

  description: string;

}> = [

  {

    id: "taeyang",

    title: "태양인",

    description: "강한 추진력과 위로 뻗는 에너지가 특징인 드문 유형",

  },

  {

    id: "taeum",

    title: "태음인",

    description: "묵직한 안정감과 축적형 리듬이 강한 지속형 유형",

  },

  {

    id: "soyang",

    title: "소양인",

    description: "빠른 반응과 표현력이 돋보이는 에너지 확산형 유형",

  },

  {

    id: "soeum",

    title: "소음인",

    description: "신중함과 섬세한 회복 리듬이 강한 내면 집중형 유형",

  },

];

/** 쿼리/문자열에서 사상체질을 안전하게 파싱합니다. */
export function parseSasangTypeIdFromName(
  raw: string | null
): SasangTypeId | null {
  if (!raw) return null;
  const v = raw.trim();

  // id 형태(taeyang 등)로 들어온 경우도 허용
  if ((v as SasangTypeId) in SASANG_META) return v as SasangTypeId;

  // name 형태(태양인/태음인/...)로 들어온 경우
  for (const id of Object.keys(SASANG_META) as SasangTypeId[]) {
    if (SASANG_META[id].name === v) return id;
  }

  return null;
}


