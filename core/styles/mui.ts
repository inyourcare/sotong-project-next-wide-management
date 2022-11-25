import { alpha, createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

// global theme
export const theme = createTheme({
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
  },
  //layout
  header: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  footer: {
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    width: `100%`,
    // position: "relative",
    overflow: "hidden",
    bottom: "0px",
    position: "absolute",
    // marginTop: "6em",
    // padding: "2em 0 ",
  },
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

export const menuTableLimit = 5
export const userTableLimit = 1000
export const projectTableLimit = 1000

export type TableColDef = {
  field: string, headerName: string
  styles?: {
    width?: string
  }
}