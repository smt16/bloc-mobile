/**
 * Brand orange scale (generic names — not "carrot").
 * Values live in `orange.js` so Tailwind can require them without a TS loader.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { orange: orangeScale } = require('./orange.js') as {
  orange: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    main: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
    soft: string;
    muted: string;
    deep: string;
    dark: string;
  };
};

export const orange = orangeScale;
export type OrangeScale = typeof orange;
