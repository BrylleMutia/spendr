import { MdClose } from "react-icons/md";
import { LinksCreator } from "./LinksCreator";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <aside>
      <div
        className={`fixed left-[-520px] top-0 z-40 h-full w-[70vw] bg-white text-white  duration-300 ease-in-out shadow-md ${
          isOpen ? "translate-x-[520px] " : "translate-x-full"
        }`}
      >
        <div className="-mt-2 flex gap-3 bg-blue-primary px-6 py-9">
          <img
            src="https://i.ibb.co/Ny0d4Ds/58874210.jpg"
            alt="profile"
            className="w-[50px] rounded-full"
          />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Brylle Mutia</h3>
            <p className="text-sm leading-none">My Wallet</p>
          </div>
          <button onClick={toggleSidebar} className="ml-3">
            <MdClose />
          </button>
        </div>
        <nav>
          <ul className="flex flex-col mt-5 text-gray-600">
            <LinksCreator />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
