import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import { useAppDispatch } from "./app/hooks";
import { getAllAccounts } from "./features/accounts/accountsSlice";

import "./App.css";
import HomepageContainer from "./pages/Homepage/HomepageContainer";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllAccounts(0));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomepageContainer />} />
      </Route>
    </Routes>
  );
}

export default App;
