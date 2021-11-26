import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
              "@global": {
              "*": {
                margin: 0,
                padding: 0
              },
              "html, body, #root": {
                height: "100%"
              },
              ul: {
                listStyle: "none"
              }
            }
          }
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: { verticalAlign: "middle" }
          }
        },
        MuiIconButton: {
          styleOverrides: {
            root: { color: "inherit" }
          }
        }
    }
});
export default theme;