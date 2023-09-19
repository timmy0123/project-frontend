import { ThemeProvider } from "@emotion/react";
import * as React from "react";
import { useColorMode } from "./color-mode-context";
import { themeMap } from "./theme";

export const AppThemeProvider = React.memo(({ children }) => {
  const { colorMode } = useColorMode();
  return <ThemeProvider theme={themeMap[colorMode]}>{children}</ThemeProvider>;
});
