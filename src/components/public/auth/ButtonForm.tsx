import React from "react";

interface ButtonFormProps {
  tailwindBClass?: string;
  nameButton: string;
  tailwindBBClass?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ButtonForm: React.FC<ButtonFormProps> = ({
  tailwindBClass = "",
  nameButton,
  tailwindBBClass = "",
  onClick,
}) => {
  return (
    <div className={`flex justify-center ${tailwindBClass}`}>
      <button
        className={`p-[10px] rounded-md text-center w-[350px] font-bold ${tailwindBBClass}`}
        onClick={onClick}
      >
        {nameButton}
      </button>
    </div>
  );
};

export default ButtonForm;
