import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import Sidebar from "./Sidebar";

type ContextType = [isSidebarOpen: boolean, handleSidebarOpen: () => void];

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleSidebarOpen = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const { accessToken } = useAppSelector((state) => state.users.user);

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <div className="h-full w-full">
        <div className="flex h-full w-full">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleSidebarOpen} />

          <main className="w-full overflow-y-scroll bg-gray-background">
            {/* Outlet is all child routes from App.tsx */}
            {/* Auth check, redirect to auth page if not authenticated */}
            {accessToken && (
              <Outlet context={[isSidebarOpen, handleSidebarOpen]} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// for providing props to outlet children / components
export const useSidebar = () => {
  return useOutletContext<ContextType>();
};

export default Layout;
