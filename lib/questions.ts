import type { Question, SasangContribution, SasangQuestionRule } from "../types";

const asSasangContribution = (c: Partial<SasangContribution>): SasangContribution => ({
  taeyang: c.taeyang ?? 0,
  taeum: c.taeum ?? 0,
  soyang: c.soyang ?? 0,
  soeum: c.soeum ?? 0,
});

const sasangRule = (
  a: Partial<SasangContribution>,
  b: Partial<SasangContribution>
): SasangQuestionRule => ({
  a: asSasangContribution(a),
  b: asSasangContribution(b),
});

// 사상체질 질문 12개 (디테일 생활 장면 중심 A/B 점수 매핑)
export const QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "sasang",
    question: "피곤하거나 스트레스를 많이 받은 날, 내 몸은 주로 어떻게 반응하나요?",
    optionA: {
      label: "얼굴이나 머리 쪽으로 열이 오르거나 예민해지고, 답답한 느낌이 드는 편이다",
    },
    optionB: {
      label: "몸이 쉽게 처지고 기운이 빠지며, 따뜻하게 쉬고 싶어지는 편이다",
    },
    sasangRule: sasangRule({ soyang: 2, taeyang: 1 }, { soeum: 2, taeum: 1 }),
  },
  {
    id: "q2",
    category: "sasang",
    question: "처음 해보는 일을 맡았을 때, 나는 보통 어떻게 움직이나요?",
    optionA: { label: "완벽히 정리되지 않아도 일단 해보면서 감을 잡는 편이다" },
    optionB: { label: "흐름을 먼저 파악하고 어느 정도 정리한 뒤 시작하는 편이다" },
    sasangRule: sasangRule({ soyang: 1, taeyang: 2 }, { soeum: 1, taeum: 2 }),
  },
  {
    id: "q3",
    category: "sasang",
    question: "여럿이 함께 있는 자리에서 내 반응은 어떤 편인가요?",
    optionA: { label: "분위기와 흐름에 빠르게 반응하고, 생각보다 먼저 말이 나오는 편이다" },
    optionB: { label: "바로 반응하기보다 상황을 보고 정리한 뒤 말하는 편이다" },
    sasangRule: sasangRule({ soyang: 2, taeyang: 1 }, { soeum: 2, taeum: 1 }),
  },
  {
    id: "q4",
    category: "sasang",
    question: "내 에너지는 보통 어떤 방식으로 느껴지나요?",
    optionA: { label: "생각과 감정이 밖으로 비교적 잘 드러나고, 주변에도 바로 전달되는 편이다" },
    optionB: { label: "겉으로는 조용해 보여도 안에서 오래 쌓이고 유지되는 편이다" },
    sasangRule: sasangRule({ taeyang: 2, soyang: 1 }, { taeum: 2, soeum: 1 }),
  },
  {
    id: "q5",
    category: "sasang",
    question: "일정이 많고 바쁘게 움직이는 날이 이어지면 나는 어떤 편인가요?",
    optionA: { label: "오히려 리듬을 타면 더 살아나고, 바쁠수록 에너지가 붙는 느낌이 있다" },
    optionB: { label: "처음엔 버티지만 점점 소모가 쌓이고, 혼자 쉬는 시간이 꼭 필요해진다" },
    sasangRule: sasangRule({ soyang: 2, taeyang: 1 }, { soeum: 1, taeum: 2 }),
  },
  {
    id: "q6",
    category: "sasang",
    question: "압박이 큰 상황이 계속되면 내 반응은 주로 어디에 가까운가요?",
    optionA: { label: "예민해지고 날카로워지거나, 속이 답답하고 열이 차오르는 느낌이 먼저 온다" },
    optionB: { label: "말수가 줄고 기운이 빠지거나, 아무것도 하기 싫은 식으로 가라앉는 편이다" },
    sasangRule: sasangRule({ soyang: 2, taeyang: 1 }, { soeum: 2, taeum: 1 }),
  },
  {
    id: "q7",
    category: "sasang",
    question: "일하거나 공부할 때 가장 잘 맞는 흐름은 무엇인가요?",
    optionA: { label: "짧게 몰입하고 빠르게 치고 나가는 방식이 더 잘 맞는다" },
    optionB: { label: "일정한 속도로 꾸준히 가는 방식이 더 안정적이고 오래 간다" },
    sasangRule: sasangRule({ soyang: 1, taeyang: 2 }, { taeum: 2, soeum: 1 }),
  },
  {
    id: "q8",
    category: "sasang",
    question: "처음 만난 사람들이 나를 느끼는 인상은 어느 쪽에 더 가깝다고 생각하나요?",
    optionA: { label: "비교적 가볍고 빠르며, 에너지가 위로 뻗는 느낌이 있다" },
    optionB: { label: "차분하고 묵직하며, 쉽게 흔들리지 않는 느낌이 있다" },
    sasangRule: sasangRule({ taeyang: 2, soyang: 1 }, { taeum: 2, soeum: 1 }),
  },
  {
    id: "q9",
    category: "sasang",
    question: "지친 날 가장 회복이 잘 되는 방식은 무엇인가요?",
    optionA: { label: "사람이나 자극, 새로운 흐름 속에 다시 들어가야 살아나는 편이다" },
    optionB: { label: "조용한 환경에서 혼자 정리하고 쉬어야 회복되는 편이다" },
    sasangRule: sasangRule({ soyang: 1, taeum: 2 }, { soeum: 2, taeyang: 1 }),
  },
  {
    id: "q10",
    category: "sasang",
    question: "갈등이나 불편한 상황이 생기면 나는 어떤 편인가요?",
    optionA: { label: "불편해도 비교적 빨리 반응하거나 표현하는 편이다" },
    optionB: { label: "바로 드러내기보다 안에서 오래 생각하고 정리하는 편이다" },
    sasangRule: sasangRule({ soyang: 2, taeum: 1 }, { soeum: 2, taeyang: 1 }),
  },
  {
    id: "q11",
    category: "sasang",
    question: "무언가 잘 풀릴 때 내 스타일은 어느 쪽에 더 가까운가요?",
    optionA: { label: "속도를 올려서 한 번에 밀어붙이는 편이다" },
    optionB: { label: "흐름을 유지하면서 무너지지 않게 가는 편이다" },
    sasangRule: sasangRule({ taeyang: 2, soyang: 1 }, { taeum: 2, soeum: 1 }),
  },
  {
    id: "q12",
    category: "sasang",
    question: "나를 가장 빨리 지치게 만드는 상황은 어느 쪽에 더 가까운가요?",
    optionA: { label: "답답하게 막힌 흐름, 느린 진행, 정체된 분위기" },
    optionB: { label: "과한 자극, 잦은 감정 소모, 예측 불가능한 흐름" },
    sasangRule: sasangRule({ soyang: 1, taeyang: 2 }, { soyang: 1, taeum: 2 }),
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

