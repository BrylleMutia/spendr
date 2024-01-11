import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import Modal from "../../../components/Modal";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addEntry } from "../../../features/entries/entriesSlice";
import { EntryInput, Purpose } from "../../../features/entries/entryTypes";
import { updateAccountAmount } from "../../../features/accounts/accountsSlice";

import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import CategoryModal from "./CategoryModal";
import AccountModal from "./AccountModal";

const AddEntry = () => {
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategory] = useState("");
  const [selectedAccountId, setSelectedAccount] = useState("");
  const [purpose, setPurpose] = useState<Purpose>("expense");
  const [note, setNote] = useState("");
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const { accounts } = useAppSelector((state) => state.accounts);
  const { categories } = useAppSelector((state) => state.categories);

  const dispatch = useAppDispatch();

  const handleChangeAmountViaCalculator = (
    e: React.MouseEvent<HTMLButtonElement>,
    value: string,
  ) => {
    e.preventDefault();

    setAmount((prev) => {
      if (prev) {
        // for handling decimal values
        const prev_split = prev.split(".");

        if (prev_split?.length > 1) {
          if (prev_split[1] === "0") {
            return `${prev_split[0]}.${value}`;
          } else return `${prev}${value}`;
        } else return `${prev}${value}`;
      } else {
        return value;
      }
    });
  };
  const handleAmountOperation = (
    e: React.MouseEvent<HTMLButtonElement>,
    operator: string,
  ) => {
    e.stopPropagation();

    if (amount) {
      setAmount((prev) => {
        if (prev) {
          // execute operation string, otherwise add operator to string
          try {
            if (operator === "=") return String(Math.abs(eval(prev)));

            return `${prev}${operator}`;
          } catch {
            return `${prev}`;
          }
        }
      });
    }
  };

  // TODO: FIX - Decimal conversion with operators in string
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

  // handlers for new entry input value change
  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  const handleSelectCategory = (categoryid: string) => {
    setSelectedCategory(categoryid);
    setIsCategoryModalOpen(false);
  };
  const handleSelectAccount = (accountid: string) => {
    setSelectedAccount(accountid);
    setIsAccountModalOpen(false);
  };
  const handleChangePurpose = (newPurpose: Purpose) => {
    setPurpose(newPurpose);
  };
  const handleChangeNote = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNote(e.target.value);

  const handleAddNewEntry = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation();
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

  // modal for choosing category on new entry
  const handleOpenCategoryModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsCategoryModalOpen(true);
  };
  const closeCategoryModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsCategoryModalOpen(false);
  };

  // modal for choosing account on new entry
  const handleOpenAccountModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsAccountModalOpen(true);
  };
  const closeAccountModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAccountModalOpen(false);
  };

  const openAddEntryModal = () => setIsAddEntryModalOpen(true);
  const closeAddEntryModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAddEntryModalOpen(false);
  };

  // TODO: NEXT - Enhance design on category and account modal / Close modal when clicked outside
  // TODO: NEXT - Add toast notifications for new entry, etc.
  // TODO: Implement transfer
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
        >
          <div className="flex items-end px-5 pb-5 pt-9 text-white">
            <span className="w-[0.7em] self-center text-[3em] tracking-tighter">
              {purpose === "income" ? "+" : "-"}
            </span>
            <input
              type="text"
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
              <button
                id="account"
                type="button"
                className="text-white"
                onClick={handleOpenAccountModal}
              >
                <span className="text-xs text-gray-text-2">Account</span>
                <br />
                <span className="text-sm">
                  {
                    accounts.find((account) => account.id === selectedAccountId)
                      ?.name
                  }
                </span>
              </button>
            </div>
            <div className="flex basis-1/2 flex-col text-center">
              <button
                type="button"
                id="category"
                className="text-white"
                onClick={handleOpenCategoryModal}
              >
                <span className="text-xs text-gray-text-2">Category</span>
                <br />
                <span className="text-sm">
                  {
                    categories.find(
                      (category) => category.id === selectedCategoryId,
                    )?.name
                  }
                </span>
              </button>
            </div>
          </div>

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
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "1")}
            >
              1
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "2")}
            >
              2
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "3")}
            >
              3
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "4")}
            >
              4
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "5")}
            >
              5
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "6")}
            >
              6
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "7")}
            >
              7
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "8")}
            >
              8
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "9")}
            >
              9
            </button>
            <button
              type="button"
              className="p-4"
              onClick={handleChangeAmountToDecimal}
            >
              .
            </button>
            <button
              type="button"
              className="p-4"
              onClick={(e) => handleChangeAmountViaCalculator(e, "0")}
            >
              0
            </button>
            <button
              type="button"
              className="p-4"
              onClick={handleDeleteAmountViaCalculator}
            >
              {"<"}
            </button>
            {/* </div> */}
            <div className="grid-rows-subgrid col-span-1 col-end-5 row-span-4 row-start-1 grid grid-rows-5">
              <button
                type="button"
                className="bg-gray-text-1 p-2"
                onClick={(e) => handleAmountOperation(e, "+")}
              >
                +
              </button>
              <button
                type="button"
                className="bg-gray-text-1 p-2"
                onClick={(e) => handleAmountOperation(e, "-")}
              >
                -
              </button>
              <button
                type="button"
                className="bg-gray-text-1 p-2"
                onClick={(e) => handleAmountOperation(e, "/")}
              >
                /
              </button>
              <button
                type="button"
                className="bg-gray-text-1 p-2"
                onClick={(e) => handleAmountOperation(e, "*")}
              >
                *
              </button>
              <button
                type="button"
                className="bg-gray-text-1 p-2"
                onClick={(e) => handleAmountOperation(e, "=")}
              >
                {"="}
              </button>
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

      <CategoryModal
        isOpen={isCategoryModalOpen}
        closeModal={closeCategoryModal}
        handleSelectCategory={handleSelectCategory}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        closeModal={closeAccountModal}
        handleSelectAccount={handleSelectAccount}
      />
    </button>
  );
};

export default AddEntry;
