import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAppSelector } from "../app/hooks";

const Layout = () => {
  const { accessToken } = useAppSelector((state) => state.users.user);

  return (
    <>
      <Header />
      <main className="App">
        {/* Outlet is all child routes from App.tsx */}
        {/* Auth check, redirect to auth page if not authenticated */}
        {accessToken && <Outlet />}
      </main>
    </>
  );
};

export default Layout;