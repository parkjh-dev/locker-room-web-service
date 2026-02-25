# Locker Room Web Service

## 프로젝트 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | locker-room-web-service |
| 생성일 | 2026-02-23 |
| 프레임워크 | React 19 |
| 언어 | TypeScript |
| 빌드 도구 | Vite |
| 패키지 매니저 | yarn |
| Node.js 버전 | v20.19.6 이상 |

## 시작하기

```bash
# 의존성 설치
yarn

# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 빌드 미리보기
yarn preview
```

## MSW Mock 환경 (개발용)

백엔드 없이 프론트엔드를 단독 실행할 수 있도록 [MSW(Mock Service Worker)](https://mswjs.io/) v2가 설정되어 있습니다.

### 동작 방식

- `yarn dev` 실행 시 development 모드에서 자동으로 MSW 워커가 시작됩니다.
- 브라우저 콘솔에 `[MSW] Mocking enabled.` 메시지가 출력되면 정상입니다.
- 프로덕션 빌드(`yarn build`)에는 MSW 코드가 포함되지 않습니다.

### 사용 방법

1. `yarn dev`로 개발 서버를 실행합니다.
2. 화면 우측 하단의 **DevSimulator** 패널에서 로그인합니다.
   - **유저 로그인**: 일반 사용자(축구광팬)로 로그인
   - **관리자 로그인**: 관리자 계정으로 로그인
3. 모든 API 호출이 MSW에 의해 mock 데이터로 응답됩니다.

### Mock 파일 구조

```
src/mocks/
├── data.ts       # 목 데이터 정의 (종목/팀/게시판/게시글/댓글/공지/알림/문의/요청/관리자)
├── handlers.ts   # API 엔드포인트 핸들러 (~40개)
└── browser.ts    # MSW 워커 설정
```

### 롤백

UI 점검 완료 후 MSW를 제거하려면 `doc/work_list.md` Phase 22.2 항목을 참고하세요.

## 프로젝트 구조

```
locker-room-web-service/
├── src/              # 소스 코드
│   ├── App.tsx       # 메인 앱 컴포넌트
│   ├── main.tsx      # 엔트리 포인트
│   └── ...
├── public/           # 정적 파일
├── index.html        # HTML 템플릿
├── vite.config.ts    # Vite 설정
├── tsconfig.json     # TypeScript 설정
└── package.json      # 프로젝트 설정
```
