/* eslint-disable react/react-in-jsx-scope */
import { paymentUpdateApi } from "@/store/api/PaymentApi";
import { paymentEntity } from "@/types/paymentEntity";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CoursePaymentFailed() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<paymentEntity | null>(null);
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  console.log(paymentId);
  useEffect(() => {
    if (paymentId) {
      async function paymentUpdate() {
        try {
          const result = await paymentUpdateApi(paymentId, "failed");
          console.log(result.data.data);
          setPaymentData(result.data.data);
          console.log(paymentData);
        } catch (error) {
          console.log(error);
        }
      }
      paymentUpdate();
    }
  }, []);
  return paymentData?._id && paymentData.status === "failed" ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-24 h-16 bg-red-500 rounded-lg relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              className="w-4 h-4 text-red-500 absolute top-1/4 left-1/4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              className="w-3 h-3 text-red-500 absolute top-1/3 right-1/4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">
            Payment Failed
          </h1>
          <p className="text-xl mb-8">
            Your payment could not be processed. Please try again.
          </p>
          <button
            onClick={() => navigate("/course")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mx-3"
          >
            courses
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default CoursePaymentFailed;
