import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import "./App.css";
import HomepageContainer from "./pages/Homepage/HomepageContainer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomepageContainer />} />
      </Route>
    </Routes>
  );
}

export default App;
