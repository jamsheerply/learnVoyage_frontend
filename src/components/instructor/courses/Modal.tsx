import React, { ReactNode } from "react";

interface ModalProps {
  shouldShow: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  shouldShow,
  onRequestClose,
  children,
}) => {
  return shouldShow ? (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      onClick={onRequestClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={onRequestClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
