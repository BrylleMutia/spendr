import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";

import Modal from "../../../components/Modal";

type AddAccountProps = {
  text: string;
};

const AddAccount = ({ text }: AddAccountProps) => {
  const [isAddAcountModalOpen, setIsAddAccountModalOpen] = useState(false);

  const openAddAccountModal = () => setIsAddAccountModalOpen(true);
  const closeAddAccountModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAddAccountModalOpen(false);
  };

  return (
    <button
      className="flex items-center rounded-md border-2 border-blue-accent px-1 py-1 text-[0.7rem] font-bold text-blue-accent"
      style={{ flexBasis: "calc(33.333333% - 0.8em)" }}
      onClick={openAddAccountModal}
    >
      <span className="text-left leading-4">{text}</span>{" "}
      <IoMdAddCircle style={{ width: "2em", height: "2em" }} />
      <Modal isOpen={isAddAcountModalOpen} closeModal={closeAddAccountModal}>
        Test
      </Modal>
    </button>
  );
};

export default AddAccount;
