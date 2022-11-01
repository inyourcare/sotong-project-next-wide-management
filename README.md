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
[해결글](https://kyounghwan01.github.io/blog/React/next/mui/#%E1%84%89%E1%85%A6%E1%84%90%E1%85%B5%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5)
공식문서를 보면서 해결 했다. 대단한 사람

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
[https://next-auth.js.org/adapters/prisma]
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

마이그레이션 코드 -> 스키마만 로드함, 변경사항도 체크함
```
npx prisma migrate dev
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
```
BROWSER=none
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXTAUTH_URL=http://localhost:3000/api/auth
```
## Oauth 연동
다음과 같이 컬백 설정
```
http://localhost:3000/api/auth/callback/kakao
```

## Next Link 사용시 css 뒤집히는 문제에 관하여 
[공식문서](https://mui.com/material-ui/guides/interoperability/)
[해답](https://github.com/mui/material-ui/issues/27149)
StyledEngineProvider 를 통해 css 순서가 뒤집히지 않도록 설정하는 방식으로 해결