# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Node.js + TypeScript + NestJS 기반 MCP(Model Context Protocol) 서버 구현 프로젝트입니다. Claude와 ChatGPT 같은 AI 플랫폼을 Google Sheets, Google Calendar 등 외부 서비스와 통합하는 것이 목표입니다.

## 필수 개발 명령어

### 빌드 및 실행
```bash
# 프로젝트 빌드
npm run build

# 개발 모드 실행 (watch 모드)
npm run start:dev

# 디버그 모드 실행
npm run start:debug

# 프로덕션 실행
npm run start:prod
```

### 테스트
```bash
# 전체 테스트 실행
npm test

# watch 모드로 테스트
npm run test:watch

# 커버리지 포함 테스트
npm run test:cov
```

### 코드 품질
```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format
```

## 아키텍처 구조

### Provider 기반 설계
외부 서비스(Google Sheets, Calendar, Notion 등)를 **Provider 모듈**로 캡슐화하여 독립적으로 관리합니다:

- **MCP Core Module** (`mcp/`): MCP 서버 핵심 로직, Registry 시스템, stdio 통신 관리
- **Providers** (`providers/`): 외부 서비스 통합 모듈
  - 각 Provider는 `tools/`, `resources/` 디렉토리로 MCP 기능을 구조화
  - Google 계열은 `providers/google/`에서 공통 인증/API 공유
- **Auth Module** (`auth/`): OAuth 2.0 기반 인증 및 토큰 관리
- **Common Module** (`common/`): 데코레이터, 인터페이스, Guards, Interceptors 등

### 계층 구조
```
MCP Protocol Layer (mcp/)
    ↓ Registry 시스템 (tool/resource/prompt)
Provider Layer (providers/)
    ↓ Tools/Resources/Prompts
Integration Layer (Google API, Notion API 등)
```

### 데코레이터 기반 등록 시스템
커스텀 데코레이터로 Tool, Resource, Prompt를 선언적으로 등록:

```typescript
// 예시: Google Sheets Read Tool
@MCPTool({
  name: 'google_sheets_read',
  description: 'Google Sheets에서 데이터 읽기',
  inputSchema: ReadRangeDto,
})
export class ReadRangeTool {
  constructor(private googleSheetsService: GoogleSheetsService) {}

  async execute(args: ReadRangeDto): Promise<ToolResult> {
    return this.googleSheetsService.readRange(args);
  }
}
```

### Registry 패턴
MCP의 3가지 핵심 개념을 각각 독립된 Registry로 관리:
- **ToolRegistry** (`mcp/registries/tool.registry.ts`): `tools/call`, `tools/list` 처리
- **ResourceRegistry** (`mcp/registries/resource.registry.ts`): `resources/read`, `resources/list` 처리
- **PromptRegistry** (`mcp/registries/prompt.registry.ts`): `prompts/get`, `prompts/list` 처리

### Provider 모듈 구조
각 Provider는 다음과 같이 구성:
```
providers/google-sheets/
├── google-sheets.module.ts      # NestJS 모듈 정의
├── google-sheets.service.ts     # Sheets API 클라이언트 래퍼
├── google-sheets.config.ts      # 설정
├── tools/                        # MCP Tools 구현
│   ├── read-range.tool.ts       # @MCPTool() 데코레이터
│   ├── write-range.tool.ts
│   └── list-sheets.tool.ts
├── resources/                    # MCP Resources (선택)
│   └── spreadsheet.resource.ts  # @MCPResource()
└── dto/                          # 입력/출력 스키마 (Zod, class-validator)
    ├── read-range.dto.ts
    └── write-range.dto.ts
```

## 기술 스택 특이사항

### ESM 모듈 시스템
- `"type": "module"` 설정으로 순수 ESM 프로젝트
- TypeScript 설정: `module: "NodeNext"`, `moduleResolution: "NodeNext"`
- Jest 설정도 ESM 지원 (`preset: 'ts-jest/presets/default-esm'`)

### Node.js 버전
- Node.js 20.0.0 이상 필수 (`engines` 필드 참조)

### 빌드 시스템
- NestJS CLI + TypeScript Compiler (tsc) 사용
- 출력 디렉토리: `./dist`
- 빈 실행 파일: `./dist/main.js`

## 개발 우선순위

### Phase 1: Core Infrastructure
1. **MCP Core 구현** - MCP 서버, Registry 시스템, stdio 통신
2. **데코레이터 시스템** - @MCPTool, @MCPResource, @MCPProvider
3. **Common 모듈** - 인터페이스, Guards, Interceptors, Pipes

### Phase 2: Google Integration
1. **Google Auth 모듈** (`providers/google/`) - OAuth 2.0 인증
2. **Google Sheets Provider** - 첫 번째 Tool 구현 (read-range)
3. **테스트 작성** - 단위 테스트 + 통합 테스트

### Phase 3: Expansion
1. **Google Calendar Provider** - 일정 관리 Tools
2. **Resource 구현** - Spreadsheet Resources
3. **E2E 테스트** - 전체 MCP 프로토콜 테스트

### Phase 4: Additional Providers
1. Notion Integration
2. Canva Integration
3. (향후 확장)

## 통합 대상 서비스

### 우선순위 1 (현재)
- **Google Sheets** - 데이터 읽기/쓰기, 시트 관리
- **Google Calendar** - 일정 생성/조회/수정/삭제

### 향후 확장
- Notion - 데이터베이스, 페이지 관리
- Canva - 디자인 생성/편집
- Slack - 메시지 전송, 채널 관리
- GitHub - 이슈, PR 관리

## 개발 가이드라인

### 새로운 Provider 추가 시
1. `providers/{service-name}/` 디렉토리 생성
2. Module, Service, Config 파일 작성
3. `tools/` 디렉토리에 각 Tool 구현 (@MCPTool 사용)
4. DTO로 입력 스키마 정의 (Zod 또는 class-validator)
5. 단위 테스트 작성 (`test/unit/providers/{service-name}/`)
6. `app.module.ts`에 Provider 모듈 등록

### Tool 구현 규칙
- 반드시 `@MCPTool` 데코레이터 사용
- `execute(args: DTO): Promise<ToolResult>` 메서드 구현
- 에러 처리는 MCP 표준 형식 준수
- 입력 검증은 DTO에서 처리

### 테스트 전략
- **Unit Test**: Service, Tool 로직 검증
- **Integration Test**: Provider 전체 플로우 검증 (모킹된 API)
- **E2E Test**: MCP 프로토콜 통신 검증 (실제 stdio)
