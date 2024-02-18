import { MdClose } from "react-icons/md";
import { LinksCreator } from "./LinksCreator";
import { useAppSelector } from "../app/hooks";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { photoURL, name } = useAppSelector((state) => state.users.user);

  return (
    <nav
      className={`max-sm:sidebar-toggle bg-blue-primary w-[18em] ${
        isOpen ? "max-sm:translate-x-[700px]" : "max-sm:translate-x-full"
      } flex-col sm:flex`}
    >
      <div className="-mt-2 flex items-center bg-blue-primary px-6 py-9">
        <img
          src={
            photoURL
              ? photoURL
              : "https://i.ibb.co/YRsRb90/handy-game-icon-1.png"
          }
          alt="profile"
          className="h-[50px] w-[50px] rounded-full border-[1px] border-blue-accent bg-white p-[1px] mr-2"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm leading-none">My Wallet</p>
        </div>
        <button onClick={toggleSidebar} className="ml-3 md:hidden">
          <MdClose />
        </button>
      </div>
      <div>
        <ul className="mt-5 flex flex-col text-gray-600">
          <LinksCreator />
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
