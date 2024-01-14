import React from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  hideCloseButton?: boolean;
};

const Modal = ({
  isOpen,
  closeModal,
  children,
  hideCloseButton = false,
}: ModalProps) => {
  const handleCloseModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeModal();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-black opacity-[0.7]"></div>
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white">
        <button
          hidden={hideCloseButton}
          onClick={(e) => handleCloseModal(e)}
          className="absolute right-4 top-4"
        >
          <MdClose />
        </button>
        {children}
      </div>
    </>,
    document.getElementById("modal")!,
  );
};

export default Modal;
