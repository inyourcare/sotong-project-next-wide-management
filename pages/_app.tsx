import type { AppProps } from 'next/app'
import { Provider } from "react-redux"
import { ThemeProvider } from "@material-ui/styles"
import CssBaseline from "@material-ui/core/CssBaseline"

import green from "@material-ui/core/colors/green"
import grey from "@material-ui/core/colors/grey"
import { createMuiTheme } from "@material-ui/core/styles"

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={MuiTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}



// type Props = {
//   Component: React.Component
//   store: any
// }

// class MyApp extends App<Props> {
//   componentDidMount() {
//     // Remove the server-side injected CSS.
//     const jssStyles = document.querySelector("#jss-server-side")
//     jssStyles?.parentNode?.removeChild(jssStyles)
//   }

//   render() {
//     const { store, Component, pageProps } = this.props

//     return (
//       <Provider store={store}>
//         <ThemeProvider theme={MuiTheme}>
//           {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
//           <CssBaseline />
//           <Component {...pageProps} />
//         </ThemeProvider>
//       </Provider>
//     )
//   }
// }

// export default withRedux(makeStore, {
//   debug: false,
// })(MyApp)