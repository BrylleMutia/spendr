import React from "react";
import { IoMdAddCircle } from "react-icons/io";

type AddAccountProps = {
  text: string;
};

const AddAccount = ({ text }: AddAccountProps) => {
  return (
    <button
      className="flex items-center rounded-md border-2 border-blue-accent px-1 py-1 text-[0.75rem] font-bold text-blue-accent"
      style={{ flexBasis: "calc(33.333333% - 0.55em)" }}
    >
      <span className="text-left leading-4">{text}</span>{" "}
      <IoMdAddCircle style={{ width: "2em", height: "2em" }} />
    </button>
  );
};

export default AddAccount;
