import React, { useState } from "react";
import Modal from "../../../components/Modal";
import { IoMdAddCircle } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addNewCategory } from "../../../features/categories/categoriesSlice";

type AddCategoryProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
};

const AddCategory = ({ isOpen, handleCloseModal }: AddCategoryProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);

  const { id } = useAppSelector((state) => state.users.user);
  const dispatch = useAppDispatch();

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };
  const handleAddNewCategory = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
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

      handleCloseModal();
    }
  };

  const handleIconUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconUrl(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} closeModal={() => handleCloseModal()}>
      <h3 className="font-semibold">Add new category</h3>

      <form
        action="POST"
        className="mt-5 flex flex-col gap-2"
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
    </Modal>
  );
};

export default AddCategory;
