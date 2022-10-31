This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

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