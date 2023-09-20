import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ObjectProvider } from "@/lib/core/main-content";
import { useEffect, useState } from "react";
import "../styles/global.scss";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [isBrowsingPage, setIsBrowsingPage] =
    useState<string>("WangUP (=θωθ=)");

  useEffect(() => {
    const handleBlur = () => {
      setIsBrowsingPage("WangUP (ノ‵□′)ノ～┴─┴");
    };

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      setIsBrowsingPage("WangUP (=θωθ=)");
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title> {isBrowsingPage}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ObjectProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <Component {...pageProps} />
      </ObjectProvider>
    </CacheProvider>
  );
}
// <ProjectProvider> use share state value
