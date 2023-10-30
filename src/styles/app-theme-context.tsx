import { ThemeProvider } from "@emotion/react";
import * as React from "react";
import { useColorMode } from "./color-mode-context";
import { themeMap } from "./theme";

interface apptype {
  children: any;
}
export const AppThemeProvider = React.memo<apptype>(({ children }) => {
  const { colorMode } = useColorMode();
  return <ThemeProvider theme={themeMap[colorMode]}>{children}</ThemeProvider>;
});

AppThemeProvider.displayName = "AppThemeProvider";
