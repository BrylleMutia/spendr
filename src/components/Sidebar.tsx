import { MdClose } from "react-icons/md";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <aside>
      <div
        className={`fixed left-[-400px] top-0 z-40 h-full w-[50vw] bg-gray-background p-10 text-white  duration-300 ease-in-out ${
          isOpen ? "translate-x-[400px] " : "translate-x-full"
        }`}
      >
        <h3 className="mt-2 font-semibold text-white">I am a sidebar</h3>
        <button onClick={toggleSidebar}>
          <MdClose />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
