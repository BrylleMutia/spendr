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

  // TODO: NEXT - New modal for choose account / category
  // TODO: NEXT - Calculator layout for new entry
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
          className="flex flex-col bg-blue-primary"
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

          <div className="flex w-full justify-center">
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

          <div className="grid grid-cols-4 place-content-around bg-white px-5">
            {/* <div className="grid-rows-subgrid row-span-3 grid grid-rows-5"> */}
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>0</div>
            <div>{"<"}</div>
            <div>.</div>
            {/* </div> */}
            <div className="grid-rows-subgrid grid grid-rows-5 col-end-5 col-span-1 row-start-1">
              <div className="bg-gray-text-1">+</div>
              <div className="bg-gray-text-1">-</div>
              <div className="bg-gray-text-1">/</div>
              <div className="bg-gray-text-1">*</div>
              <div className="bg-gray-text-1">{"="}</div>
            </div>
          </div>

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
