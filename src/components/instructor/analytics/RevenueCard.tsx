import React from "react";

// Revenue Card Component
interface RevenueCardProps {
  title: string;
  value: string;
  // change: string;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  value,
  // change,
}) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        <span className="text-gray-400">...</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {/* <div
        className={`text-sm ${
          change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </div> */}
    </div>
  );
};
