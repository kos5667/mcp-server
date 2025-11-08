# mcp-server
node.js, typescript, nest.js를 이용한 mcp서버 구축.

주로 사용하는.
cluade, chatgpt 연동.


## 지원하는 Tools.
- google sheets
- google calender

## Package Tree
```text
mcp-server/
├── src/
│   ├── main.ts                          # 애플리케이션 부트스트랩
│   ├── app.module.ts                    # 루트 모듈
│   │
│   ├── common/                          # 공통 유틸리티
│   │   ├── decorators/                  # 커스텀 데코레이터
│   │   │   ├── mcp-provider.decorator.ts
│   │   │   ├── mcp-tool.decorator.ts
│   │   │   ├── mcp-resource.decorator.ts
│   │   │   └── mcp-prompt.decorator.ts
│   │   ├── interfaces/                  # 공통 인터페이스
│   │   │   ├── tool.interface.ts
│   │   │   ├── resource.interface.ts
│   │   │   └── prompt.interface.ts
│   │   ├── guards/                      # Guards
│   │   │   ├── rate-limit.guard.ts
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/                # Interceptors
│   │   │   ├── logging.interceptor.ts
│   │   │   └── cache.interceptor.ts
│   │   ├── filters/                     # Exception Filters
│   │   │   └── provider.exception.filter.ts
│   │   └── pipes/                       # Validation Pipes
│   │       └── tool-validation.pipe.ts
│   │
│   ├── config/                          # 설정 모듈
│   │   ├── config.module.ts
│   │   ├── configuration.ts             # 설정 팩토리
│   │   └── validation.schema.ts         # 환경 변수 검증
│   │
│   ├── mcp/                             # MCP 코어 모듈
│   │   ├── mcp.module.ts
│   │   ├── mcp.service.ts              # MCP 서버 코어 로직
│   │   ├── mcp.controller.ts           # stdio 통신 핸들러
│   │   ├── registries/                 # Registry 서비스
│   │   │   ├── tool.registry.ts       # Tool 등록/조회
│   │   │   ├── resource.registry.ts   # Resource 등록/조회
│   │   │   └── prompt.registry.ts     # Prompt 등록/조회
│   │   ├── handlers/                   # MCP 요청 핸들러
│   │   │   ├── tools.handler.ts       # tools/call, tools/list
│   │   │   ├── resources.handler.ts   # resources/read, resources/list
│   │   │   └── prompts.handler.ts     # prompts/get, prompts/list
│   │   └── dto/
│   │       ├── call-tool.dto.ts
│   │       ├── list-resources.dto.ts
│   │       └── get-prompt.dto.ts
│   │
│   ├── providers/                       # 프로바이더 모듈들
│   │   │
│   │   ├── google/                      # 공통 Google 인증/API
│   │   │   ├── google.module.ts
│   │   │   ├── google-auth.service.ts  # OAuth 2.0
│   │   │   ├── google-api.service.ts   # 공통 API 클라이언트
│   │   │   └── config/
│   │   │       └── google.config.ts
│   │   │
│   │   ├── google-sheets/              # Google Sheets 모듈
│   │   │   ├── google-sheets.module.ts
│   │   │   ├── google-sheets.service.ts
│   │   │   ├── google-sheets.config.ts
│   │   │   ├── tools/                  # MCP Tools 정의
│   │   │   │   ├── read-range.tool.ts
│   │   │   │   ├── write-range.tool.ts
│   │   │   │   └── list-sheets.tool.ts
│   │   │   ├── resources/              # MCP Resources
│   │   │   │   └── spreadsheet.resource.ts
│   │   │   └── dto/
│   │   │       ├── read-range.dto.ts
│   │   │       └── write-range.dto.ts
│   │   │
│   │   ├── google-calendar/            # Google Calendar 모듈
│   │   │   ├── google-calendar.module.ts
│   │   │   ├── google-calendar.service.ts
│   │   │   ├── google-calendar.config.ts
│   │   │   ├── tools/
│   │   │   │   ├── create-event.tool.ts
│   │   │   │   ├── list-events.tool.ts
│   │   │   │   └── update-event.tool.ts
│   │   │   └── dto/
│   │   │       ├── create-event.dto.ts
│   │   │       └── list-events.dto.ts
│   │   │
│   │   ├── notion/                      # Notion 모듈 (향후)
│   │   │   ├── notion.module.ts
│   │   │   ├── notion.service.ts
│   │   │   ├── tools/
│   │   │   └── dto/
│   │   │
│   │   └── canva/                       # Canva 모듈 (향후)
│   │       ├── canva.module.ts
│   │       ├── canva.service.ts
│   │       ├── tools/
│   │       └── dto/
│   │
│   ├── auth/                            # 인증 모듈
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── oauth.strategy.ts
│   │   │   └── api-key.strategy.ts
│   │   └── token-store.service.ts
│   │
│   ├── cache/                           # 캐시 모듈
│   │   ├── cache.module.ts
│   │   ├── cache.service.ts
│   │   └── cache.config.ts
│   │
│   └── logging/                         # 로깅 모듈
│       ├── logging.module.ts
│       ├── logging.service.ts
│       └── logging.config.ts
│
├── test/                                # 테스트
│   ├── unit/                            # 단위 테스트
│   │   ├── providers/
│   │   │   ├── google-sheets/
│   │   │   │   ├── google-sheets.service.spec.ts
│   │   │   │   └── tools/
│   │   │   │       └── read-range.tool.spec.ts
│   │   │   └── google-calendar/
│   │   ├── mcp/
│   │   │   └── tool.registry.spec.ts
│   │   └── auth/
│   ├── integration/                     # 통합 테스트
│   │   ├── google-sheets.integration.spec.ts
│   │   └── google-calendar.integration.spec.ts
│   └── e2e/                             # E2E 테스트
│       ├── mcp-protocol.e2e-spec.ts
│       └── google-sheets.e2e-spec.ts
│
├── scripts/                             # 유틸리티 스크립트
│   ├── setup-google-oauth.ts            # OAuth 설정 도구
│   └── test-mcp-stdio.ts                # MCP 연결 테스트
│
├── package.json
├── tsconfig.json
├── nest-cli.json
├── jest.config.cjs
├── .env.example
├── .env
├── Dockerfile
└── docker-compose.yml
```
