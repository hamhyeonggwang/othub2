# 사회성숙도 검사 웹앱 (SMS)

Social Maturity Scale (김승국·김옥기) 디지털 검사 도구

## 주요 기능

- 117문항 전체 채점 (연령 구간별 탭 탐색)
- 채점 기호: `+` / `+F` / `+NO` / `±` / `-`
- SA(사회연령), SQ(사회지수) 자동 산출
- 영역별 결과 (C, S, SHG, SHD, SHE, L, O, SD)
- 검사 기록 로컬 저장 (localStorage)
- Google Sheets 연동 (Apps Script 웹훅)

## 개발 환경 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## Google Sheets 연동 설정

1. `google-apps-script.js` 파일을 참고하여 Google Apps Script 프로젝트 생성
2. `SPREADSHEET_ID`를 본인 스프레드시트 ID로 변경
3. 배포 → 새 배포 → 웹앱 (모든 사용자 접근 허용)
4. 앱 내 결과 화면 → Google Sheets 저장 → 배포 URL 입력

## 기술 스택

- React + Vite
- Tailwind CSS v3
- Google Apps Script (Sheets 연동)
