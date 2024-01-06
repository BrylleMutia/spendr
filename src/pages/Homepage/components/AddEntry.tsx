import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import Modal from "../../../components/Modal";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addEntry } from "../../../features/entries/entriesSlice";
import { EntryInput, Purpose } from "../../../features/entries/entryTypes";
import { IoMdAddCircle } from "react-icons/io";
import AddCategory from "./AddCategory";
import { updateAccountAmount } from "../../../features/accounts/accountsSlice";

import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

const AddEntry = () => {
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategory] = useState("");
  const [selectedAccountId, setSelectedAccount] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("expense");
  const [note, setNote] = useState("");
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const { accounts } = useAppSelector((state) => state.accounts);
  const { categories } = useAppSelector((state) => state.categories);

  const dispatch = useAppDispatch();

  const handleChangeAmountViaCalculator = (value: string) => {
    if (amount) {
      setAmount((prev) => {
        if (prev) {
          // for handling decimal values
          const prev_split = prev.split(".");

          if (prev_split?.length > 1) {
            if (prev_split[1] === "0") {
              return `${prev_split[0]}.${value}`;
            } else return `${prev}${value}`;
          } else return `${prev}${value}`;
        }
      });
    } else {
      return setAmount(value);
    }
  };
  const handleChangeAmountToDecimal = () => {
    if (amount) {
      setAmount((prev) => String(Number.parseFloat(String(prev)).toFixed(1)));
    }
  };
  const handleDeleteAmountViaCalculator = () => {
    if (amount) {
      setAmount((prev) => `${prev}`.substring(0, String(prev).length - 1));
    } else return;
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value);
  const handleChangeCategory = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.currentTarget.value);
  };
  const handleChangeAccount = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedAccount(e.currentTarget.value);
  };
  const handleChangePurpose = (newPurpose: Purpose) => {
    setPurpose(newPurpose);
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
        amount: Number.parseFloat(amount),
        purpose,
      };

      dispatch(addEntry(newEntryDetails))
        .unwrap()
        .then(() =>
          // update account amount
          dispatch(
            updateAccountAmount({
              accountId: selectedAccountId,
              amount: Number.parseFloat(amount),
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

  // TODO: NEXT - New modal for choose account / category
  // TODO: NEXT - Add decimal + operators to calculator
  // TODO: Implement transfer
  // TODO: Add toast notifications
  // TODO: Improved category UI
  return (
    <button
      className="fixed bottom-10 right-7 h-[3.5em] w-[3.5em] rounded-full bg-blue-accent"
      onClick={openAddEntryModal}
    >
      <span className="flex h-full w-full items-center justify-center">
        <IoAdd
          style={{ width: "60%", height: "60%", color: "#fff", opacity: "1" }}
        />
      </span>

      <Modal isOpen={isAddEntryModalOpen} closeModal={closeAddEntryModal}>
        <div className="w-full px-4 py-3">
          <h3 className="text-sm font-semibold">Add entry</h3>
        </div>

        <hr />

        <div className="flex w-full bg-blue-secondary">
          <button
            className={`z-10 basis-1/2 py-2 text-sm font-bold text-white shadow-md ${
              purpose === "income" && "bg-blue-primary"
            }`}
            onClick={() => handleChangePurpose("income")}
          >
            INCOME
          </button>
          <button
            className={`z-10 basis-1/2 py-3 text-sm font-bold text-white shadow-md ${
              purpose === "expense" && "bg-blue-primary"
            }`}
            onClick={() => handleChangePurpose("expense")}
          >
            EXPENSE
          </button>
        </div>

        <form
          action="POST"
          className="flex flex-col rounded-b-lg bg-blue-primary"
          onSubmit={handleAddNewEntry}
        >
          <div className="flex items-end px-5 pb-5 pt-9 text-white">
            <span className="w-[0.7em] self-center text-[3em] tracking-tighter">
              {purpose === "income" ? "+" : "-"}
            </span>
            <input
              type="number"
              id="amount"
              className="custom-placeholder max-w-[3.5em] bg-inherit text-right text-[4em] font-bold outline-none"
              contentEditable
              value={amount}
              onChange={handleChangeAmount}
              placeholder="0"
              autoFocus
              disabled
            />
            <label htmlFor="amount" className="ml-5 pb-4 text-[1rem]">
              PHP
            </label>
          </div>

          <div className="flex py-3">
            <div className="flex basis-1/2 flex-col text-center">
              <label htmlFor="account" className="text-xs text-gray-text-2">
                Account
              </label>
              <button id="account" className="font-semibold text-white">
                {
                  accounts.find((account) => account.id === selectedAccountId)
                    ?.name
                }
              </button>
            </div>
            <div className="flex basis-1/2 flex-col text-center">
              <label htmlFor="category" className="text-xs text-gray-text-2">
                Category
              </label>
              <button id="category" className="font-semibold text-white">
                {
                  categories.find(
                    (category) => category.id === selectedCategoryId,
                  )?.name
                }
              </button>
            </div>
          </div>

          {/* <label htmlFor="category" hidden>
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
          </select> */}

          <div className="mb-4 flex w-full justify-center">
            <label htmlFor="account-name" hidden>
              Note
            </label>
            <input
              type="text"
              id="note"
              placeholder="Notes"
              className="input-text-primary text-gray-text-2"
              value={note}
              onChange={handleChangeNote}
            />
          </div>

          <div className="grid grid-cols-4 grid-rows-4 place-content-around bg-white px-5 text-center text-2xl font-light text-gray-text-2">
            {/* <div className="grid-rows-subgrid row-span-3 grid grid-rows-5"> */}
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("1")}
            >
              1
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("2")}
            >
              2
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("3")}
            >
              3
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("4")}
            >
              4
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("5")}
            >
              5
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("6")}
            >
              6
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("7")}
            >
              7
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("8")}
            >
              8
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("9")}
            >
              9
            </button>
            <button className="p-4" onClick={handleChangeAmountToDecimal}>
              .
            </button>
            <button
              className="p-4"
              onClick={() => handleChangeAmountViaCalculator("0")}
            >
              0
            </button>
            <button className="p-4" onClick={handleDeleteAmountViaCalculator}>
              {"<"}
            </button>
            {/* </div> */}
            <div className="grid-rows-subgrid col-span-1 col-end-5 row-span-4 row-start-1 grid grid-rows-5">
              <button className="bg-gray-text-1 p-2">+</button>
              <button className="bg-gray-text-1 p-2">-</button>
              <button className="bg-gray-text-1 p-2">/</button>
              <button className="bg-gray-text-1 p-2">*</button>
              <button className="bg-gray-text-1 p-2">{"="}</button>
            </div>
          </div>

          <div className="mt-4 flex">
            <button
              type="submit"
              className="btn-logo-accent grow rounded-none rounded-bl-md bg-gray-text-1 py-3"
              onClick={closeAddEntryModal}
            >
              <IoCloseSharp />
            </button>
            <button
              type="submit"
              className="btn-logo-accent grow rounded-none rounded-br-md"
              onClick={handleAddNewEntry}
            >
              <FaCheck />
            </button>
          </div>
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
