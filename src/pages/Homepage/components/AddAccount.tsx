import React, { useState, useRef } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addNewAccount } from "../../../features/accounts/accountsSlice";

import Modal from "../../../components/Modal";
import Snackbar, { CountdownHandle } from "../../../components/Snackbar";

type AddAccountProps = {
  text: string;
};

const AddAccount = ({ text }: AddAccountProps) => {
  const [accountName, setAccountName] = useState("");
  const [initialAmount, setInitialAmount] = useState<number | undefined>(
    undefined,
  );
  const [isAddAcountModalOpen, setIsAddAccountModalOpen] = useState(false);

  const successSnackbarRef = useRef<CountdownHandle>(null);
  const failSnackbarRef = useRef<CountdownHandle>(null);

  const { id } = useAppSelector((state) => state.users.user);
  const dispatch = useAppDispatch();

  const handleChangeAccountName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAccountName(e.target.value);
  const handleChangeInitialAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInitialAmount(Number(e.target.value));

  const handleAddNewAccount = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (accountName) {
      const newAccountDetails = {
        userId: id,
        name: accountName,
        amount: initialAmount ?? 0,
      };

      dispatch(addNewAccount(newAccountDetails));
      setIsAddAccountModalOpen(false);
      setAccountName("");
      setInitialAmount(0);
      closeAddAccountModal(e);

      if (successSnackbarRef.current) {
        successSnackbarRef.current.show();
      }
    } else {
      if (failSnackbarRef.current) {
        failSnackbarRef.current.show();
      }
    }
  };

  const openAddAccountModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAddAccountModalOpen(true);
  };

  const closeAddAccountModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAddAccountModalOpen(false);
  };
  const handleCloseAddAccountModal = () => setIsAddAccountModalOpen(false);

  return (
    <button
      className="flex items-center justify-center rounded-md border-2 border-blue-accent px-1 py-1 text-[0.7rem] font-bold text-blue-accent"
      style={{ flexBasis: "calc(33.333333% - 0.8em)" }}
      onClick={openAddAccountModal}
    >
      <span className="text-left leading-4">{text}</span>{" "}
      <IoMdAddCircle style={{ width: "2em", height: "2em" }} />
      <Modal
        isOpen={isAddAcountModalOpen}
        closeModal={handleCloseAddAccountModal}
      >
        <h3 className="pl-3 pt-3 font-semibold">Add new account</h3>

        <form
          action="POST"
          className="mt-5 flex flex-col gap-2 p-3"
          onSubmit={handleAddNewAccount}
        >
          <label htmlFor="account-name" hidden>
            Account Name
          </label>
          <input
            type="text"
            id="account-name"
            placeholder="Account Name"
            className="input-text-primary"
            value={accountName}
            onChange={handleChangeAccountName}
            required
          />
          <label htmlFor="initial-amount" hidden>
            Initial Amount
          </label>
          <input
            type="number"
            name="initial-amount"
            id="initial-amount"
            className="input-text-primary"
            placeholder="Initial Amount (optional)"
            value={initialAmount}
            onChange={handleChangeInitialAmount}
          />
          <button type="submit" className="btn-logo-accent mt-3">
            <IoMdAddCircle style={{}} />
            <span>Add Account</span>
          </button>
        </form>
      </Modal>
      <Snackbar
        message="Account added!"
        type="success"
        ref={successSnackbarRef}
      />
      <Snackbar
        ref={failSnackbarRef}
        message="Please provide required details."
        type="error"
      />
    </button>
  );
};

export default AddAccount;
