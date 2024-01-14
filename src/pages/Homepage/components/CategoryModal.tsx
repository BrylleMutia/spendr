import { useState } from "react";
import Modal from "../../../components/Modal";
import AddCategory from "./AddCategory";

import { useAppSelector } from "../../../app/hooks";
type CategoryModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  handleSelectCategory: (catgegoryid: string) => void;
};

const CategoryModal = ({
  isOpen,
  closeModal,
  handleSelectCategory,
}: CategoryModalProps) => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const { categories } = useAppSelector((state) => state.categories);

  const handleOpenNewCategoryModal = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setIsAddCategoryModalOpen(true);
  };
  const closeAddCategoryModal = (
    e: React.FormEvent<HTMLButtonElement | HTMLFormElement>,
  ) => {
    e.stopPropagation();
    setIsAddCategoryModalOpen(false);
  };
  const handleCloseModal = () => setIsAddCategoryModalOpen(false);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} hideCloseButton={true}>
      <h3 className="px-3 pt-2 text-center text-lg font-bold text-blue-secondary">
        Category
      </h3>
      <div className="flex w-[15em] flex-col p-4">
        {categories.map((category) => (
          <button
            className="border-1 border border-gray-text-1 py-2 transition-all duration-200 hover:bg-blue-primary"
            value={category.id}
            onClick={() => handleSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
        <button
          onClick={handleOpenNewCategoryModal}
          className="btn-accent mt-2"
        >
          New
        </button>

        <AddCategory
          isOpen={isAddCategoryModalOpen}
          handleCloseModal={handleCloseModal}
          closeModal={closeAddCategoryModal}
        />
      </div>
    </Modal>
  );
};

export default CategoryModal;
