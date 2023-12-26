import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import Modal from "../../../components/Modal";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addEntry } from "../../../features/entries/entriesSlice";
import { EntryInput, Purpose } from "../../../features/entries/entryTypes";
import { IoMdAddCircle } from "react-icons/io";
import AddCategory from "./AddCategory";
import { updateAccountAmount } from "../../../features/accounts/accountsSlice";

const AddEntry = () => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategory] = useState("");
  const [selectedAccountId, setSelectedAccount] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("expense");
  const [note, setNote] = useState("");
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const { accounts } = useAppSelector((state) => state.accounts);
  const { categories } = useAppSelector((state) => state.categories);

  const dispatch = useAppDispatch();

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(Number(e.target.value));
  const handleChangeCategory = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.currentTarget.value);
  };
  const handleChangeAccount = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.currentTarget.value);
  };
  const handleChangePurpose = (e: React.FormEvent<HTMLSelectElement>) => {
    setPurpose(e.currentTarget.value as Purpose);
  };
  const handleChangeNote = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNote(e.target.value);

  const handleAddNewEntry = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (purpose && amount && selectedAccountId && selectedCategoryId) {
      const newEntryDetails: EntryInput = {
        categoryId: selectedCategoryId,
        accountId: selectedAccountId,
        note,
        amount,
        purpose,
      };

      dispatch(addEntry(newEntryDetails))
        .unwrap()
        .then(() =>
          // update account amount
          dispatch(
            updateAccountAmount({
              accountId: selectedAccountId,
              amount,
              purpose,
            }),
          ),
        );
      closeAddEntryModal(e);

      setPurpose("expense");
      setAmount(undefined);
      setNote("");

      console.log("add new entry triggered");
    }
  };

  const handleOpenCategoryModal = () => setIsAddCategoryModalOpen(true);
  const closeAddCategoryModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAddCategoryModalOpen(false);
  };

  const openAddEntryModal = () => setIsAddEntryModalOpen(true);
  const closeAddEntryModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAddEntryModalOpen(false);
  };

  // TODO: Fix design for modals
  // TODO: Add toast notifications
  // TODO: Improved category UI
  return (
    <button
      className="fixed bottom-10 right-7 h-[3.5em] w-[3.5em] rounded-full bg-blue-accent"
      onClick={openAddEntryModal}
    >
      <span className="flex h-full w-full items-center justify-center">
        <IoAdd style={{ width: "60%", height: "60%", color: "#fff", opacity: "1" }} />
      </span>

      <Modal isOpen={isAddEntryModalOpen} closeModal={closeAddEntryModal}>
        <h3 className="font-semibold">Add entry</h3>

        <form
          action="POST"
          className="mt-5 flex flex-col gap-2"
          onSubmit={handleAddNewEntry}
        >
          <label htmlFor="account-name" hidden>
            Amount
          </label>
          <input
            type="number"
            id="amount"
            placeholder="Amount"
            className="input-text-primary"
            value={amount}
            onChange={handleChangeAmount}
            required
          />

          <label htmlFor="category" hidden>
            Category
          </label>
          <select
            name="category"
            id="category"
            value={selectedCategoryId}
            onChange={handleChangeCategory}
            onLoad={handleChangeCategory}
            className="input-text-primary bg-white"
            required
          >
            <option value="" disabled selected className="">
              Category
            </option>
            {categories.map((category) => (
              <option value={category.id}>{category.name}</option>
            ))}
            <option onClick={handleOpenCategoryModal}>New category</option>
          </select>

          <label htmlFor="account" hidden>
            Account
          </label>
          <select
            name="account"
            id="account"
            value={selectedAccountId}
            className="input-text-primary bg-white"
            onChange={handleChangeAccount}
            required
          >
            <option value="" disabled selected>
              Account
            </option>
            {accounts.map((account) => (
              <option value={account.id}>{account.name}</option>
            ))}
          </select>

          <label htmlFor="purpose" hidden>
            Purpose
          </label>
          <select
            name="purpose"
            id="purpose"
            value={purpose}
            className="input-text-primary bg-white"
            onChange={handleChangePurpose}
            required
          >
            <option value="expense" selected>
              Expense
            </option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
          </select>

          <label htmlFor="account-name" hidden>
            Note
          </label>
          <input
            type="text"
            id="note"
            placeholder="Notes"
            className="input-text-primary"
            value={note}
            onChange={handleChangeNote}
          />
          <button
            type="submit"
            className="btn-logo-accent mt-3"
            onClick={handleAddNewEntry}
          >
            <IoMdAddCircle />
            <span>Add entry</span>
          </button>
        </form>
      </Modal>

      <AddCategory
        isOpen={isAddCategoryModalOpen}
        handleCloseModal={closeAddCategoryModal}
      />
    </button>
  );
};

export default AddEntry;
