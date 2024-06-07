import React, { useState } from "react";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { editInstructor } from "../store/Instructors/InstructorsActions";

interface TableData {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  id: string;
}

interface TableProps {
  TableHead: string[];
  TableData?: TableData[];
}

const Table: React.FC<TableProps> = ({ TableHead, TableData }) => {
  const dispatch: AppDispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TableData | null>(null);

  const handleBlockUnblock = (user: TableData) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmBlockUnblock = async () => {
    if (selectedUser) {
      const { id, isBlocked } = selectedUser;
      await dispatch(editInstructor({ id, isBlocked: !isBlocked }));
      setShowModal(false);
    }
  };

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
          {TableData?.map((tableData) => (
            <tr key={tableData.id}>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {tableData.firstName} {tableData.lastName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {tableData.email}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                {tableData.isBlocked ? (
                  <span className="text-red-500 p-3 rounded-lg font-bold w-24">
                    Blocked
                  </span>
                ) : (
                  <span className="text-green-500 p-3 rounded-lg font-bold w-24">
                    Active
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                {tableData.isBlocked ? (
                  <button
                    className="bg-green-500 p-3 rounded-lg font-bold w-24"
                    onClick={() => handleBlockUnblock(tableData)}
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    className="bg-red-500 p-3 rounded-lg font-bold w-24"
                    onClick={() => handleBlockUnblock(tableData)}
                  >
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <Modal
          shouldShow={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <div className="p-4">
            <h2 className="text-xl mb-4">
              Are you sure you want to{" "}
              {selectedUser?.isBlocked ? "unblock" : "block"} this user?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-red-500 p-2 rounded-lg m-2"
                onClick={confirmBlockUnblock}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 p-2 rounded-lg m-2"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Table;
