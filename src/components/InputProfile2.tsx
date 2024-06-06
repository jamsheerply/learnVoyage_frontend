import React from "react";

interface InputProfileProps {
  type: string;
  placeholder: string;
}

const InputProfile2: React.FC<InputProfileProps> = ({ type, placeholder }) => {
  return (
    <div className="p-2">
      <input
        type={type}
        placeholder={placeholder}
        className=" rounded-md w-[310px] h-[40px] border p-2 text-gray-600"
      />
    </div>
  );
};

export default InputProfile2;
