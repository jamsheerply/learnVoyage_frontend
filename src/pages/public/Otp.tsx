import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonForm from "../../components/public/auth/ButtonForm";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { resendOtp, verifyOtp } from "../../store/auth/authActions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RotateCcw } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { RootState } from "@/store/store";

const Otp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  interface User {
    [key: string]: string | number;
    otp: string;
  }

  const [user, setUser] = useState<User>({
    otp: "",
    userId: auth.userId,
  });

  const [errors, setErrors] = useState("");
  const [time, setTime] = useState(120);

  useEffect(() => {
    if (auth.loginError) {
      toast.error(auth.loginError.error);
    }
    if (auth.userId && auth.isVerified) {
      if (auth.role === "student") {
        navigate("/student/overview");
      } else if (auth.role === "instructor") {
        navigate("/instructor/overview");
      } else if (auth.role === "admin") {
        navigate("/admin/overview");
      }
    } else if (!auth.userId) {
      navigate("/student-auth/signin");
    }
  }, [auth.userId, auth.isVerified, auth.role, navigate, auth.loginError]);

  const schema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .min(6, "OTP must be at least 6 characters")
      .max(6, "OTP must be less than 6 characters"),
  });

  useEffect(() => {
    if (time > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [time]);

  const handleResendOtp = () => {
    dispatch(resendOtp({ email: auth.email, userId: auth.userId }) as any);
    setTime(120);
  };

  const handleVerifyOtp = async () => {
    try {
      await schema.validate(user, { abortEarly: false });
      setErrors("");
      dispatch(verifyOtp(user) as any);
    } catch (validationErrors: any) {
      const firstError = validationErrors.inner[0].message;
      setErrors(firstError);
    }
  };

  return (
    <div className="grid grid-cols-1 min-h-screen lg:grid-cols-1">
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex-col items-end w-[80%] p-2">
          <div className={`w-full h-full flex-col my-6 `}>
            <div className="flex justify-center">
              <input
                type="text"
                className="bg-gray-200 p-[10px] w-[350px] rounded-md px-4"
                placeholder="Enter OTP"
                value={user.otp}
                onChange={(e) => setUser({ ...user, otp: e.target.value })}
              />
            </div>
            <div className="sm:px-[195px] lg:px-[425px] text-red-500">
              {errors && <p>{errors}</p>}
            </div>
          </div>
          <div className="flex gap-44 justify-center mb-5">
            <div>Remaining time: {time}</div>
            {time === 0 ? (
              <RotateCcw
                color="green"
                className="cursor-pointer"
                onClick={handleResendOtp}
              />
            ) : (
              <ClipLoader color="#22c55e" />
            )}
          </div>
          <ButtonForm
            nameButton="Sign Up"
            tailwindBClass="my-2"
            tailwindBBClass="bg-green-600 text-white"
            onClick={handleVerifyOtp}
          />
        </div>
      </div>
    </div>
  );
};

export default Otp;
