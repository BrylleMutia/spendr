import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import "./App.css";
import UsersPage from "./features/users/usersPage";

function App() {
   return (
      <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<UsersPage />} />
         </Route>
      </Routes>
   );
}

export default App;
