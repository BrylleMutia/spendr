import React, { useState, useRef } from "react";
import Modal from "../../../components/Modal";
import { IoMdAddCircle } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addNewCategory } from "../../../features/categories/categoriesSlice";
import Snackbar, { CountdownHandle } from "../../../components/Snackbar";

type AddCategoryProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
  closeModal: (e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => void;
};

const AddCategory = ({
  isOpen,
  handleCloseModal,
  closeModal,
}: AddCategoryProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);

  const successSnackbarRef = useRef<CountdownHandle>(null);
  const failSnackbarRef = useRef<CountdownHandle>(null);

  const { id } = useAppSelector((state) => state.users.user);
  const dispatch = useAppDispatch();

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };
  const handleAddNewCategory = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (newCategory) {
      dispatch(
        addNewCategory({
          name: newCategory,
          userId: id,
          iconUrl:
            iconUrl ?? "https://i.ibb.co/McWW7vH/florid-small-coin-stack.png",
        }),
      );

      closeModal(e);

      if (successSnackbarRef.current) {
        successSnackbarRef.current.show();
      }
    } else {
      if (failSnackbarRef.current) {
        failSnackbarRef.current.show();
      }
    }
  };

  const handleIconUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconUrl(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} closeModal={handleCloseModal}>
      <h3 className="pl-3 pt-3 font-semibold">Add new category</h3>

      <form
        action="POST"
        className="mt-5 flex flex-col gap-2 p-3"
        onSubmit={handleAddNewCategory}
      >
        <label htmlFor="category-name" hidden>
          Category
        </label>
        <input
          type="text"
          id="category"
          placeholder="Category"
          className="input-text-primary"
          value={newCategory}
          onChange={handleCategoryNameChange}
          required
        />
        <label htmlFor="icon-url" hidden>
          Category
        </label>
        <input
          type="text"
          id="icon-url"
          placeholder="Icon URL (optional)"
          className="input-text-primary"
          value={iconUrl}
          onChange={handleIconUrlChange}
        />

        <button type="submit" className="btn-logo-accent mt-3">
          <IoMdAddCircle />
          <span>Add category</span>
        </button>
      </form>

      <Snackbar
        message="Category added!"
        type="success"
        ref={successSnackbarRef}
      />
      <Snackbar
        ref={failSnackbarRef}
        message="Please provide required details."
        type="error"
      />
    </Modal>
  );
};

export default AddCategory;
