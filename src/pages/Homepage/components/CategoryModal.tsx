import React, { useState } from "react";
import Modal from "../../../components/Modal";
import AddCategory from "./AddCategory";

import { useAppSelector } from "../../../app/hooks";

type CategoryModalProps = {
  isOpen: boolean;
  closeModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSelectCategory: (catgegoryid: string) => void;
};

const CategoryModal = ({
  isOpen,
  closeModal,
  handleSelectCategory,
}: CategoryModalProps) => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const { categories } = useAppSelector((state) => state.categories);

  const handleOpenNewCategoryModal = () => setIsAddCategoryModalOpen(true);
  const closeAddCategoryModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation(); // stop event propagation to parent from modal portal component
    setIsAddCategoryModalOpen(false);
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} hideCloseButton={true}>
      <div className="flex w-[15em] flex-col p-4">
        {categories.map((category) => (
          <button
            className="border-1 border border-gray-text-1 py-2"
            value={category.id}
            onClick={() => handleSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
        <button onClick={handleOpenNewCategoryModal} className="btn-accent mt-2">
          Add new category
        </button>
        <AddCategory
          isOpen={isAddCategoryModalOpen}
          handleCloseModal={closeAddCategoryModal}
        />
      </div>
    </Modal>
  );
};

export default CategoryModal;
