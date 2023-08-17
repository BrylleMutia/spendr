import React from "react";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { SlList } from "react-icons/sl";
import { Link } from "react-router-dom";

type LinkType = {
  text: string;
  link: string;
  icon: React.ReactNode;
};

export const LinksCreator = () => {
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
  ];

  return (
    <>
      {links.map((link, index) => (
        <Link key={index} to={link.link} className="px-7 py-4 flex items-center gap-5 hover:bg-gray-text-1">
          {link.icon}
          {link.text}
        </Link>
      ))}
    </>
  );
};
