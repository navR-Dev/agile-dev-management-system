import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { theme } from "./theme";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.font.family};
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

ReactDOM.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </AuthProvider>,
  document.getElementById("root")
);
