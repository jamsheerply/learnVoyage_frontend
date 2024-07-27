import { PenTool } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  categoryName: string;
  isBlocked: boolean;
  image: string;
}

interface TableProps {
  TableHead: string[];
  TableData: Category[];
}

const TableCategories: React.FC<TableProps> = ({ TableHead, TableData }) => {
  const navigate = useNavigate();
  return (
    <div>
      <table className="min-w-full border divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {TableHead.map((head, index) => (
              <th
                key={index}
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {TableData &&
            TableData.map((category, index) => (
              <tr key={category.id}>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {category.categoryName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {category.isBlocked ? "Blocked" : "Active"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    className="w-10 h-10"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={() => {
                      navigate(`/admin/edit-category/${category.id}`);
                    }}
                  >
                    <PenTool />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCategories;
