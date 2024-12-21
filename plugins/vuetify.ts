import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const Lighttheme: ThemeDefinition = {
  dark: false,
  variables: {},
  colors: {
    primary: "#19485f", // estaba este  #1e88e5   d9e0a4
    info: "#03c9d7",
    success: "#4caf50",
    accent: "#fc4b6c",
    warning: "#ff9800",
    error: "#f44336",
    secondary: "#d9e0a4", // estaba este  #0cb9c5   19485f
  },
};
export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp

  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: Lighttheme,
        variables: {},
      },
    },
    display: {
      mobileBreakpoint: "sm",
      thresholds: {
        xs: 0,
        sm: 340,
        md: 540,
        lg: 800,
        xl: 1280,
      },
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
