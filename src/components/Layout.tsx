import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="App">
        {/* Outlet is all child routes from App.tsx */}
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;
