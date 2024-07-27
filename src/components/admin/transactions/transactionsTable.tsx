import { paymentEntity } from "@/types/paymentEntity";
import React from "react";

interface TransactionsTableProps {
  transactions: paymentEntity[];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  console.log(JSON.stringify(transactions));
  //[{"_id":"66a24241cff0ee6e79ea5949","userId":"668fd54adea48c7ae478ed62","courseId":"668642e4f571c5f721885acd","method":"card","status":"completed","amount":349,"createdAt":"2024-07-25T12:17:05.644Z","__v":0},{"_id":"66a243df3448068e9b9d1384","userId":"668fd573dea48c7ae478ed6a","courseId":"668642e4f571c5f721885acd","method":"card","status":"completed","amount":349,"createdAt":"2024-07-25T12:23:59.545Z","__v":0}]
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
                      <p className="text-sm">React js</p>
                      <div className="text-sm text-gray-500">
                        by instructor 01
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">student 01</td>
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
