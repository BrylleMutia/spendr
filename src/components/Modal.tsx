import React from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

type ModalProps = {
  isOpen: boolean;
  closeModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, closeModal, children }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-50 bg-black opacity-[0.7]"></div>
      <div className="padding-10 fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white">
        {children}
        <button onClick={(e) => closeModal(e)} className="bg-red-500">
          <MdClose />
        </button>
      </div>
    </>,
    document.getElementById("modal")!,
  );
};

export default Modal;
