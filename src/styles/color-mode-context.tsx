import * as React from "react";
import * as _ from "lodash";
import { PaletteMode } from "@mui/material";

export const defaultColorMode: PaletteMode = "light";

export interface IColorModeContext {
  toggleColorMode: () => void;
  colorMode: PaletteMode;
}

export const ColorModeContext = React.createContext<IColorModeContext>({
  toggleColorMode: _.noop,
  colorMode: defaultColorMode,
});

export const useColorMode = () => React.useContext(ColorModeContext);

export const ColorModeProvider = React.memo(({ children }) => {
  const [mode, setMode] = React.useState<PaletteMode>(defaultColorMode);
  const value: IColorModeContext = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    },
    colorMode: mode,
  };
  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
});
