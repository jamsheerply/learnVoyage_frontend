import React from "react";

React;

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <span className="mr-2 text-green-600">
          <span className="w-6 h-6 inline-block bg-green-200 rounded-full">
            {icon}
          </span>
        </span>
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};
