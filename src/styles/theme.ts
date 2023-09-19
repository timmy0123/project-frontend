import { PaletteMode } from "@mui/material";
import {
  createTheme,
  Duration,
  Palette,
  PaletteColor,
  responsiveFontSizes,
  Theme,
  ThemeOptions,
  Transitions,
  TypographyStyle,
} from "@mui/material/styles";
import { createStyled } from "@mui/system";
import { defaultColorMode } from "./color-mode-context";

// Create a theme instance.
const color = {
  yellow: {
    100: "#F2B705",
    200: "#F29F05",
    300: "#FAC012",
    400: "#D4A002",
  },
  purple: {
    100: "#D2D7F8",
    200: "#949FF2",
    300: "#6770E6",
    400: "#4D54AD",
    500: "#A1A5E6",
  },
  blueGrey: {
    100: "#366A83",
    200: "#044564",
    300: "#03344B",
    400: "#5D879C",
    500: "#546E7A",
    600: "#455A64",
    700: "#37474F",
    800: "#263238",
    900: "#1C262A",
    1000: "#0D1619",
    1100: "#000F15",
    1200: "#1D262B",
    1300: "#29373E",
    1400: "#2D3C43",
    1500: "#222D32",
  },
  white: {
    100: "#FFFFFF",
    200: "#AAAAB2",
    300: "#DADADA",
    400: "#C4D2D7",
  },
  black: {
    100: "#323233",
    200: "#242426",
    300: "#000000",
  },
  orange: {
    100: "#FF5C00",
  },
} as const;

export interface TMofyDuration extends Duration {
  navigationBarFadingOut: number;
}

export interface TMofyTransitions extends Transitions {
  duration: TMofyDuration;
}

export interface MeetingTheme {
  footerHeight: number;
  mobileFooterHeight: number;
  sidebarWidth: number;
  sidebarMobileHeight: number;
  sidebarMobilePadding: number;
  participantBorderWidth: number;
  mobileTopBarHeight: number;
}

interface TMofyThemeColor {
  color: typeof color & {
    carousel: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
    };
  };
}

export interface TMofyTheme extends Theme, Partial<TMofyThemeColor> {
  transitions: TMofyTransitions;
}

interface TMofyThemeOptions extends ThemeOptions, Partial<TMofyThemeColor> {
  transitions: TMofyTransitions;
}

const _themeLight: TMofyThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#00838f",
    },
    secondary: {
      main: "#3f51b5",
    },
    error: {
      main: "#d50000",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  typography: {
    h5: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      fontWeight: 500,
      fontSize: "1.875rem",
      lineHeight: 1.334,
      letterSpacing: "0em",
    },
  },
  transitions: <TMofyTransitions>{
    duration: <TMofyDuration>{
      navigationBarFadingOut: 2500,
    },
  },
};

const _themeDark: TMofyThemeOptions = {
  ..._themeLight,
  palette: {
    ..._themeLight.palette,
    mode: "dark",
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
};

export const themeLight = responsiveFontSizes(
  createTheme(_themeLight)
) as TMofyTheme;

export const themeDark = responsiveFontSizes(
  createTheme(_themeDark)
) as TMofyTheme;

export const themeMap: { [mode in PaletteMode]: TMofyTheme } = {
  light: themeLight,
  dark: themeDark,
};

export const defaultTheme = themeMap[defaultColorMode];

export const styled = createStyled<TMofyTheme>({ defaultTheme });
