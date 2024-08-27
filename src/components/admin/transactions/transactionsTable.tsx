import { readAllStudentApi } from "@/store/api/AuthApi";
import { getAllCoursesList } from "@/store/course/coursesActions";
import { AppDispatch, RootState } from "@/store/store";
import { paymentEntity } from "@/types/paymentEntity";
import { IUser } from "@/types/user.entity";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface TransactionsTableProps {
  transactions: paymentEntity[];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const [student, setStudent] = useState<IUser[] | null>([]);
  const dispatch: AppDispatch = useDispatch();

  // Select category data from Redux store
  const { courses } = useSelector((state: RootState) => state.courses);

  // console.log("courses", JSON.stringify(courses));

  // console.log("transactions", JSON.stringify(transactions));
  const findCourseInfo = (transaction, courses, infoType) => {
    const course = courses.find((c) => c._id === transaction.courseId);

    console.log("course", course);
    if (!course) {
      return null;
    }
    switch (infoType) {
      case "courseName":
        return course.courseName;
      case "mentorId":
        return course.mentorId;
      case "full":
        return {
          courseName: course.courseName,
          mentorId: course.mentorId,
        };
      default:
        return course.courseName;
    }
  };
  useEffect(() => {}, [courses]);

  // Fetch all courses on component mount
  useEffect(() => {
    dispatch(getAllCoursesList());
  }, [dispatch]);
  useEffect(() => {
    const fetchUser = async () => {
      const studentResponse = await readAllStudentApi();

      setStudent(studentResponse.data.data);
    };
    fetchUser();
  }, []);

  const findStudentInfo = (
    userId: string,
    students: IUser[],
    infoType = "full"
  ) => {
    const student = students.find((s) => s._id === userId);

    if (!student) {
      return null;
    }

    switch (infoType) {
      case "full":
      default:
        return `${student.firstName} ${student.lastName}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      {transactions.length ? (
        <table className="w-full min-w-max">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Method</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              {/* <th className="px-6 py-3">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id?.toString()} className="border-t">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://res.cloudinary.com/dwcytg5ps/image/upload/v1720074303/erx24gyqq4jrlfpyat3h.jpg"
                      alt="Course"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm">
                        {findCourseInfo(
                          transaction.courseId,
                          courses,
                          "courseName"
                        )}
                        reactjs
                      </p>
                      <div className="text-sm text-gray-500">
                        by instructor 01
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {findStudentInfo(transaction.userId, student, "full")}
                </td>
                <td className="px-6 py-4">₹{transaction.amount}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 rounded">
                    {transaction.method}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                </td>
                <td className="px-6 py-4">{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No transactions found.
        </div>
      )}
    </div>
  );
};
