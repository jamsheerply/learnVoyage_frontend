import React from "react";

interface InputFormProps {
  tailwindIClass?: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg?: string;
}

const InputForm: React.FC<InputFormProps> = ({
  tailwindIClass = "",
  type,
  placeholder = "",
  value,
  onChange,
  errorMsg = "",
}) => {
  return (
    <div className={`w-full h-full flex-col ${tailwindIClass}`}>
      <div className="flex justify-center">
        <input
          type={type}
          className="bg-gray-200 p-[10px] w-[350px] rounded-md px-4"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="sm:px-[195px] lg:px-[130px] text-red-500">
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default InputForm;
