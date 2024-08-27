/* eslint-disable react/react-in-jsx-scope */
import Footer from "@/components/public/common/Footer";
import { paymentUpdateApi } from "@/store/api/PaymentApi";
import { paymentEntity } from "@/types/paymentEntity";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CoursePaymentSuccess() {
  const [paymentData, setPaymentData] = useState<paymentEntity | null>(null);
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const navigate = useNavigate();
  useEffect(() => {
    if (paymentId) {
      async function paymentUpdate() {
        try {
          const result = await paymentUpdateApi(paymentId, "completed");
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
  return paymentData?._id && paymentData.status === "completed" ? (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="w-full max-w-md">
          <img
            src="https://res.cloudinary.com/dwcytg5ps/image/upload/v1721823153/fcexclli9qt7g3ecz2t5.png"
            alt="Celebration illustration"
            className="w-full h-auto mb-8"
          />

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Payment Successfully</h1>
            <p className="text-xl mb-8">
              Your course has been successfully processed
            </p>

            <button
              onClick={() => navigate("/student/enrollments")}
              className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mx-3"
            >
              Enrollments
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default CoursePaymentSuccess;
