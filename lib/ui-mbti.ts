import type { MbtiChoice, MbtiType } from "../types";

/** 테스트 Step1 표시 순서 (요구사항 순) */
export const MBTI_ORDER: MbtiType[] = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

/** sessionStorage 등에서 읽은 값을 안전하게 MbtiChoice로 파싱 */
export function parseMbtiChoiceFromStorage(raw: string | null): MbtiChoice | null {
  if (raw == null || raw === "") return null;
  if (raw === "unknown") return "unknown";
  if (MBTI_ORDER.includes(raw as MbtiType)) return raw as MbtiType;
  return null;
}
