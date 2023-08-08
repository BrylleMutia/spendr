import { useState } from "react";
import Sidebar from "./Sidebar";
import { AiOutlineMenu } from "react-icons/ai";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <nav>
      <div className="align-center flex bg-blue-secondary p-4 text-white">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <button onClick={toggleSidebar}>
          <AiOutlineMenu />
        </button>
        <h1 className="ml-2 inline font-bold leading-4">Home</h1>
      </div>
    </nav>
  );
};

export default Header;
