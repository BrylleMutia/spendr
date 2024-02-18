import { signOut } from "firebase/auth";
import React from "react";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { SlList } from "react-icons/sl";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../api/fireStore";
import { useAppDispatch } from "../app/hooks";
import { logoutUser } from "../features/users/usersSlice";
import { clearEntries } from "../features/entries/entriesSlice";
import { RiLogoutCircleLine } from "react-icons/ri";

type LinkType = {
  text: string;
  icon: React.ReactNode;
  link?: string;
  hasFunction?: () => void;
};

export const LinksCreator = () => {
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        // console.log("user signed out");
        dispatch(logoutUser());
        dispatch(clearEntries());
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const links: LinkType[] = [
    {
      text: "Home",
      link: "/home",
      icon: <AiFillHome />,
    },
    {
      text: "Account",
      link: "/account",
      icon: <CgProfile />,
    },
    {
      text: "Records",
      link: "/records",
      icon: <SlList />,
    },
    {
      text: "Logout",
      icon: <RiLogoutCircleLine />,
      hasFunction: handleLogOut,
    },
  ];

  return (
    <div className="pl-5">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.link ? link.link : ""}
          onClick={link.hasFunction}
          className="flex items-center gap-5 px-7 py-4 hover:bg-blue-accent"
        >
          {link.icon}
          {link.text}
        </Link>
      ))}
    </div>
  );
};
