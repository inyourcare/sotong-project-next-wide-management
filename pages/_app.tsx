import type { AppProps } from 'next/app'
import { Provider } from "react-redux"
import CssBaseline from "@material-ui/core/CssBaseline"
import rootReducer, { rootSaga, store } from '@core/redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

import { createWrapper } from "next-redux-wrapper";
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next';
import { theme } from '@core/styles/mui'
import Layout from '@components/layout/default/Layout'
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from 'react'
import "nprogress/nprogress.css";
import NextNProgress from 'nextjs-progressbar';


const makeStore = () => store;
export type AppStore = ReturnType<typeof makeStore>;
export const wrapper = createWrapper<AppStore>(makeStore)
declare global {
  interface Window {
    Kakao: any;
  }
}

export function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    console.log('app start', process.env.KAKAO_CLIENT_ID, process.env)
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    };
  }, []);
  const [layout, setLayout] = useState(true)
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <StyledEngineProvider injectFirst>
                {/* <AppHead /> */}
                <CssBaseline />

                <button onClick={() => setLayout(!layout)} style={{
                  color: "red", 
                  position: 'relative',
                  // position: 'static',
                  top: '10px',
                  left: '50%',
                  // transform: 'translate(-50%,50%)',
                  transform: 'translateX(-50%)',
                  zIndex: '100000'
                }}>layout</button>
                <Layout
                  // type your page title and page description.
                  title="Template - Next.js and Material-UI with Header and Footer"
                  description="This is a Template using Next.js and Material-UI with Header and Footer."
                  enable={layout}
                >
                  <NextNProgress />
                  <Component {...pageProps} />
                </Layout>
              </StyledEngineProvider>
            </ThemeProvider>
          </Provider>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default appWithTranslation(wrapper.withRedux(App));