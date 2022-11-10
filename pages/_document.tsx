import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@mui/styles";

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta name="description" content="HTML meta tag page" />
                    <script defer src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async ctx => {
    const materialSheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => materialSheets.collect(<App {...props} />)
        });

    const initialProps = await Document.getInitialProps(ctx);
    return {
        ...initialProps,
        styles: <>{initialProps.styles}</>
    };
};