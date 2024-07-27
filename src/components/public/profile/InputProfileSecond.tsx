import React from "react";

interface InputProfileProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg?: string;
}

const InputProfile2: React.FC<InputProfileProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  errorMsg = "",
}) => {
  return (
    <div>
      <div className="p-2">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="rounded-md w-[310px] h-[40px] border p-2 text-gray-600"
        />
      </div>
      <div className="px-2 text-red-500">{errorMsg && <p>{errorMsg}</p>}</div>
    </div>
  );
};

export default InputProfile2;
