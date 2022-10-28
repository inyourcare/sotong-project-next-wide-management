import type { AppProps } from 'next/app'
import { Provider } from "react-redux"
import { ThemeProvider } from "@material-ui/styles"
import CssBaseline from "@material-ui/core/CssBaseline"

import green from "@material-ui/core/colors/green"
import grey from "@material-ui/core/colors/grey"
import { createMuiTheme } from "@material-ui/core/styles"

import rootReducer, { rootSaga } from './core/redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'

//////// Theme ///////
const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      light: grey[700],
      main: grey[800],
      dark: grey[900],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
})
////////////////////////

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(logger).concat(sagaMiddleware),
})
sagaMiddleware.run(rootSaga);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={MuiTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}