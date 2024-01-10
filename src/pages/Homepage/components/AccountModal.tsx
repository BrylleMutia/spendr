import React from "react";
import Modal from "../../../components/Modal";

import { useAppSelector } from "../../../app/hooks";

type AccountModalProps = {
  isOpen: boolean;
  closeModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSelectAccount: (accountid: string) => void;
};

const AccountModal = ({
  isOpen,
  closeModal,
  handleSelectAccount,
}: AccountModalProps) => {
  const { accounts } = useAppSelector((state) => state.accounts);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} hideCloseButton={true}>
      <div className="flex w-[15em] flex-col p-4">
        {accounts.map((account) => (
          <button
            className="border-1 border border-gray-text-1 py-2"
            value={account.id}
            onClick={() => handleSelectAccount(account.id)}
          >
            {account.name}
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default AccountModal;
