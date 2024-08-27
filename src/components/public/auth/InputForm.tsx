import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`w-full h-full flex-col ${tailwindIClass}`}>
      <div className="relative w-full">
        <input
          type={type === "password" && showPassword ? "text" : type}
          className="bg-gray-200 p-[10px] w-full rounded-md px-4 pr-10"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
      </div>
      {errorMsg && <p className="text-red-500 mt-1">{errorMsg}</p>}
    </div>
  );
};

export default InputForm;
