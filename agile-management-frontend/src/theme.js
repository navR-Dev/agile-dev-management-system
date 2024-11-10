// src/theme.js
export const theme = {
  colors: {
    primary: "#6200ea",
    secondary: "#03dac6",
    background: "#f5f5f5",
    textPrimary: "#212121",
    textSecondary: "#757575",
  },
  font: {
    family: "'Roboto', sans-serif",
    weight: {
      regular: 400,
      bold: 700,
    },
  },
  spacing: (factor) => `${8 * factor}px`,
};
