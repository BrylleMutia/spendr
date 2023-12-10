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
    <aside>
      <div
        className={`fixed left-[-520px] top-0 z-40 h-full w-[70vw] bg-white text-white  shadow-md duration-300 ease-in-out ${
          isOpen ? "translate-x-[520px] " : "translate-x-full"
        }`}
      >
        <div className="-mt-2 flex items-center gap-3 bg-blue-primary px-6 py-9">
          <img
            src={
              photoURL
                ? photoURL
                : "https://i.ibb.co/YRsRb90/handy-game-icon-1.png"
            }
            alt="profile"
            className="h-[50px] w-[50px] rounded-full border-[1px] border-blue-accent bg-white p-[1px]"
          />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm leading-none">My Wallet</p>
          </div>
          <button onClick={toggleSidebar} className="ml-3">
            <MdClose />
          </button>
        </div>
        <nav>
          <ul className="mt-5 flex flex-col text-gray-600">
            <LinksCreator />
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
