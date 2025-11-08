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
│   ├── main.ts                      # 애플리케이션 진입점
│   ├── app.module.ts                # 루트 모듈
│   ├── mcp/
│   │   ├── mcp.module.ts            # MCP 모듈
│   │   ├── mcp.service.ts           # MCP 서버 관리
│   │   └── interfaces/
│   │       └── mcp-server.interface.ts
│   ├── tools/
│   │   ├── tools.module.ts          # Tools 모듈
│   │   ├── tools.service.ts         # Tools 관리
│   │   ├── handlers/
│   │   │   ├── calculator.handler.ts
│   │   │   ├── file.handler.ts
│   │   │   └── search.handler.ts
│   │   └── decorators/
│   │       └── tool.decorator.ts    # 커스텀 데코레이터
│   ├── resources/
│   │   ├── resources.module.ts      # Resources 모듈
│   │   ├── resources.service.ts     # Resources 관리
│   │   ├── handlers/
│   │   │   ├── file-resource.handler.ts
│   │   │   └── database-resource.handler.ts
│   │   └── decorators/
│   │       └── resource.decorator.ts
│   ├── prompts/
│   │   ├── prompts.module.ts        # Prompts 모듈
│   │   ├── prompts.service.ts       # Prompts 관리
│   │   ├── templates/
│   │   │   ├── code-review.template.ts
│   │   │   └── data-analysis.template.ts
│   │   └── decorators/
│   │       └── prompt.decorator.ts
│   ├── database/
│   │   ├── database.module.ts       # 데이터베이스 모듈
│   │   └── database.service.ts
│   ├── config/
│   │   ├── configuration.ts         # 설정 파일
│   │   └── validation.schema.ts     # 환경변수 검증
│   └── common/
│       ├── filters/
│       │   └── mcp-exception.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── utils/
│           └── logger.util.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── tools/
├── jest.config.cjs
├── nest-cli.json
├── tsconfig.json
├── package.json
└── .env
```
