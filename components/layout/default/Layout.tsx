import React from 'react';
import Head from "next/head";
import Header from './Header';
import Footer from './Footer';

type LayoutParam = {
    children: any,
    title: string,
    description: string,
    ogImage?: string,
    url?: string
}
export default function Layout({ children, title, description, ogImage, url }: LayoutParam) {
    // website Url
    const pageUrl =
        "https://nextjs-and-material-ui-template-with-header-and-footer.vercel.app/";
    // when you share this page on facebook you'll see this image
    const ogImg = "https://i.imgur.com/1H2TK2B.png";
    return(
    <>
        <Head>
            <title>
                {title
                    ? title
                    : "Template - Next.js and Material-UI with Header and Footer"}
            </title>
            <meta
                name="description"
                key="description"
                content={
                    description
                        ? description
                        : "This is a Template using Next.js and Material-UI with Header and Footer."
                }
            />
            <meta
                property="og:title"
                content={
                    title
                        ? title
                        : "Template - Next.js and Material-UI with Header and Footer"
                }
                key="og:title"
            />
            <meta property="og:url" content={url ? url : pageUrl} key="og:url" />
            <meta
                property="og:image"
                content={ogImage ? ogImage : ogImg}
                key="og:image"
            />
            <meta
                property="og:description"
                content={
                    description
                        ? description
                        : "This is a Template using Next.js and Material-UI with Header and Footer."
                }
                key="og:description"
            />
        </Head>
        <Header />
        <main>{children}</main>
        <Footer />
    </>);
}