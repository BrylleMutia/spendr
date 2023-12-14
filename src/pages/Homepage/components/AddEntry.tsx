import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import Modal from "../../../components/Modal";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addEntry } from "../../../features/entries/entriesSlice";
import { EntryInput, Purpose } from "../../../features/entries/entryTypes";
import { IoMdAddCircle } from "react-icons/io";

const AddEntry = () => {
  const [amount, setAmount] = useState(0);
  const [selectedCategoryId, setSelectedCategory] = useState("");
  const [selectedAccountId, setSelectedAccount] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("expense");
  const [note, setNote] = useState("");
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);

  const { id } = useAppSelector((state) => state.users.user);
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

  const handleAddNewEntry = () => {
    if (purpose && amount && selectedAccountId && selectedCategoryId) {
      const newEntryDetails: EntryInput = {
        categoryId: selectedCategoryId,
        accountId: selectedAccountId,
        note,
        amount,
        purpose,
      };

      dispatch(addEntry(newEntryDetails));
      setIsAddEntryModalOpen(false);

      setPurpose("expense");
      setAmount(0);
      setNote("");
    }
  };

  const openAddEntryModal = () => setIsAddEntryModalOpen(true);
  const closeAddEntryModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAddEntryModalOpen(false);
  };

  // TODO: NEXT - Add category modal / fix design for modals
  return (
    <button
      className="fixed bottom-10 right-7 h-[3.5em] w-[3.5em] rounded-full bg-blue-accent"
      onClick={openAddEntryModal}
    >
      <span className="flex h-full w-full items-center justify-center">
        <IoAdd style={{ width: "60%", height: "60%", color: "#fff" }} />
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
          />

          <label htmlFor="category" hidden>
            Category
          </label>
          <select
            name="category"
            id="category"
            value={selectedCategoryId}
            onChange={handleChangeCategory}
            className="input-text-primary bg-white"
          >
            {categories.map((category, index) => (
              <option value={category.id} selected={index === 1 ? true : false}>
                {category.name}
              </option>
            ))}
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
          >
            {accounts.map((account, index) => (
              <option value={account.id} selected={index === 1 ? true : false}>
                {account.name}
              </option>
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
          <button type="submit" className="btn-logo-accent mt-3">
            <IoMdAddCircle style={{}} />
            <span>Add entry</span>
          </button>
        </form>
      </Modal>
    </button>
  );
};

export default AddEntry;
