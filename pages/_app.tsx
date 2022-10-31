import type { AppProps } from 'next/app'
import { Provider } from "react-redux"
import CssBaseline from "@material-ui/core/CssBaseline"
import rootReducer, { rootSaga } from '../core/redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

import { createWrapper } from "next-redux-wrapper";

// global theme
const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

// global style classes
export const useStyles = makeStyles(() => ({
  // common
  alignCenterBasic: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  height100vh: {
    height: "100vh",
  },
  width100P: {
    width: "100%"
  },
  marginTop3: {
    marginTop: theme.spacing(3),
    // marginTop: theme.palette.primary.main,
  },

  //sign in
  signIn_sideImage: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#6242FB",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  signIn_Btn: {
    margin: theme.spacing(0, 0, 1),
  }
}));

interface IMuiVariables {
  TextField: {
    variant: {
      outlined: "filled" | "outlined" | "standard" | undefined,
      standard: "filled" | "outlined" | "standard" | undefined,
      filled: "filled" | "outlined" | "standard" | undefined
    }
  }
}
export const MuiVariables: IMuiVariables = {
  TextField: {
    variant: {
      outlined: "outlined",
      standard: "standard",
      filled: "filled"
    }
  }
}
////////////////////////

// const sagaMiddleware = createSagaMiddleware();
// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//     serializableCheck: false,
//   }).concat(logger).concat(sagaMiddleware),
// })
// sagaMiddleware.run(rootSaga);

//////////////////
const sagaMiddleware = createSagaMiddleware();
// const makeStore = () =>
//   configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//       serializableCheck: false,
//     }).concat(logger).concat(sagaMiddleware),
//   })
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(logger).concat(sagaMiddleware),
})
sagaMiddleware.run(rootSaga);
const makeStore = () => store;
export type AppStore = ReturnType<typeof makeStore>;
export const wrapper = createWrapper<AppStore>(makeStore)

export function App({ Component, pageProps }: AppProps) {
  const {store, props} = wrapper.useWrappedStore(pageProps);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

// export default wrapper.useWrappedStore(App);
export default wrapper.withRedux(App);