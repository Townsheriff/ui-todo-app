import "./app.css";
import React, { useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createApolloClient } from "./store/client";
import { ApolloProvider } from "@apollo/client";
import { TodoPage } from "./pages/todo-page/todo-page";
import { SnackbarProvider } from "notistack";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const App = () => {
  const apolloClient = useMemo(() => {
    return createApolloClient();
  }, []);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
          <SnackbarProvider
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            autoHideDuration={5000}
          >
            <TodoPage />
          </SnackbarProvider>
        </ApolloProvider>
      </ThemeProvider>
    </>
  );
};
