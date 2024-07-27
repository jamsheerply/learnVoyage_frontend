import React from "react";

interface InputProfileProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg?: string;
  disabled?: boolean;
}

const InputProfile: React.FC<InputProfileProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  errorMsg = "",
  disabled = false,
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
          className={`rounded-md w-[350px] h-[40px] border p-2 text-gray-600 ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
        />
      </div>
      <div className="lg:px-3 text-red-500">
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default InputProfile;
