# MBTI × 사상체질 연구소

Next.js(App Router) + TypeScript + Tailwind CSS로 만든 조합 테스트 MVP입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 을 엽니다.

프로덕션 빌드:

```bash
npm run build
npm start
```

## 구조

| 경로 | 설명 |
|------|------|
| `app/page.tsx` | 랜딩 |
| `app/test/page.tsx` | MBTI 선택 → 사상 8문항 |
| `app/result/page.tsx` | 조합 결과 |
| `lib/questions.ts` | 문항·점수 규칙 |
| `lib/scoring.ts` | 득점·동점 타이브레이커 |
| `lib/results.ts` | 결과 생성 |
| `lib/mbti-data.ts` | MBTI 설명 |
| `lib/mbti-love-style.ts` | MBTI 연애 스타일 |
| `lib/sasang-data.ts` | 사상체질 설명 메타 |
| `lib/result-names.ts` | 대표 조합명 매핑 |
| `types/index.ts` | 공통 타입 |

※ 의학적 진단·심리평가를 대체하지 않는 콘텐츠입니다.
