import { signOut } from "firebase/auth";
import React from "react";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { SlList } from "react-icons/sl";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../api/fireStore";

type LinkType = {
  text: string;
  icon: React.ReactNode;
  link?: string;
  hasFunction?: () => void;
};

export const LinksCreator = () => {
  const handleLogOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        console.log("user signed out");
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
      icon: <SlList />,
      hasFunction: handleLogOut,
    },
  ];

  return (
    <>
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.link ? link.link : ""}
          onClick={handleLogOut}
          className="flex items-center gap-5 px-7 py-4 hover:bg-gray-text-1"
        >
          {link.icon}
          {link.text}
        </Link>
      ))}
    </>
  );
};
