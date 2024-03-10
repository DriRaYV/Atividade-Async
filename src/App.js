import React from "react";
import { HomeScreen } from "./pages/HomeScreenPage";
import GlobalStyle from "./styles/theme";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <HomeScreen />
    </>
  );
};

export default App;
