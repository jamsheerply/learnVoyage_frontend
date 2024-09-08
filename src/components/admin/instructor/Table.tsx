import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { editInstructor } from "../../../store/Instructors/InstructorsActions";
import { IUser } from "@/types/user.entity";
import Modal from "../../instructor/courses/Modal";
import { Button } from "@/shadcn/ui/button";

interface TableProps {
  instructors: IUser[];
  onInstructorUpdate: (updatedInstructor: IUser) => void;
}

const Table: React.FC<TableProps> = ({ instructors, onInstructorUpdate }) => {
  const dispatch: AppDispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleBlockUnblock = (user: IUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmBlockUnblock = async () => {
    if (selectedUser) {
      const { _id, isBlocked } = selectedUser;
      try {
        const result = await dispatch(
          editInstructor({ id: _id, isBlocked: !isBlocked })
        );
        if (editInstructor.fulfilled.match(result)) {
          const updatedInstructor = { ...selectedUser, isBlocked: !isBlocked };
          onInstructorUpdate(updatedInstructor);
        }
      } catch (error) {
        console.error("Failed to update instructor:", error);
      }
      setShowModal(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table header */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {instructors.map((instructor) => (
            <tr key={instructor._id}>
              {/* Name and avatar */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={
                        instructor.profile.avatar ||
                        "https://via.placeholder.com/40"
                      }
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{`${instructor.firstName} ${instructor.lastName}`}</div>
                    <div className="text-sm text-gray-500">
                      {instructor.profession || "Not specified"}
                    </div>
                  </div>
                </div>
              </td>
              {/* Email */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{instructor.email}</div>
              </td>
              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    instructor.isBlocked
                      ? "bg-red-400 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {instructor.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              {/* Action button */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  onClick={() => handleBlockUnblock(instructor)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    instructor && instructor.isBlocked
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {instructor.isBlocked ? "Unblock" : "Block"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
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
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={confirmBlockUnblock}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
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
