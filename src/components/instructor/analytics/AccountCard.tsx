import React from "react";

// Account Card Component
interface AccountCardProps {
  title: string;
  accountName: string;
  accountNumber: string;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  title,
  accountName,
  accountNumber,
}) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <span className="text-gray-400">...</span>
      </div>
      <div className="mb-2">
        <div className="text-sm text-gray-600">Account Name: {accountName}</div>
        <div className="text-sm text-gray-600">
          Account Number: {accountNumber}
        </div>
      </div>
      <button className="bg-green-200 text-black px-4 py-2 rounded-md w-full">
        Email
      </button>
    </div>
  );
};
