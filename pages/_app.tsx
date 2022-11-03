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

// const sagaMiddleware = createSagaMiddleware();
// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//     serializableCheck: false,
//   }).concat(logger).concat(sagaMiddleware),
// })
// sagaMiddleware.run(rootSaga);


const makeStore = () => store;
export type AppStore = ReturnType<typeof makeStore>;
export const wrapper = createWrapper<AppStore>(makeStore)

export function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            {/* <AppHead /> */}
            <CssBaseline />

            <Layout
              // type your page title and page description.
              title="Template - Next.js and Material-UI with Header and Footer"
              description="This is a Template using Next.js and Material-UI with Header and Footer."
            >
              <Component {...pageProps} />
            </Layout>
          </StyledEngineProvider>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  )
}

// export default wrapper.useWrappedStore(App);
export default appWithTranslation(wrapper.withRedux(App));
// export default appWithTranslation((App));