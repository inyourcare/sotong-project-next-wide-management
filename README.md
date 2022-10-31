# 시작하며

```
npx create-next-app@latest --typescript
실행 명령어 npm run dev
```

## default error 처리
pages 하위에 404.tsx , _error.tsx 와 같이 처리

## 동적 라우팅
pages/dynamic 에 예제 만듦 (\[id\] 와 같이 파일 이름 생성)

## 라우팅
pages 하위의 tsx 파일을 자동으로 설정

## withRedux
https://blog.logrocket.com/use-redux-next-js/
https://chaeyoung2.tistory.com/53 - getServerSideProps

## className 문제 해결 (MUI 또는 바닐라 자바스크립트 관련으로 보임)
[블로그](https://tesseractjh.tistory.com/164)
```
/.babelrc 
{
  "presets": ["next/babel"],
  "plugins": ["babel-plugin-styled-components"]
}
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "babel-plugin-styled-components", 
      {
        "ssr": true, // SSR을 위한 설정
        "displayName": true, // 클래스명에 컴포넌트 이름을 붙임
        "pure": true // dead code elimination (사용되지 않는 속성 제거)
      }
    ]
  ]
}
```

## 환경변수 실행 순서 
https://nextjs.org/docs/basic-features/environment-variables
```
process.env
.env.$(NODE_ENV).local
.env.local (Not checked when NODE_ENV is test.)
.env.$(NODE_ENV)
.env
```

## Prisma database control
```
DATABASE_URL="file:./dev.db" 
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```
설정을 활용하면 sqlite 로도 사용 가능
아래는 스키마 파일 생성 후 적용 
```
npx prisma db push
npx prisma studio
```
### 프리즈마 클라이언트 이용
```
npx prisma generate
->
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```


## .env 와 .env*.local
.env 는 아래와 같다. prisma 를 위한 설정이다. .local 파일은 next 의 환경 변수 역활을 한다.
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="database://id:pass@host:port/database?schema=public"
```

## Oauth 연동
다음과 같이 컬백 설정
```
http://localhost:3000/api/auth/callback/kakao
```