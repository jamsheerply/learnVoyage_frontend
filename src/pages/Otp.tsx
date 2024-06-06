import { useDispatch, useSelector } from "react-redux";
import ButtonForm from "../components/ButtonForm";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { verifyOtp } from "../store/auth/authActions";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: any) => state.auth);

  interface User {
    [key: string]: string | number;
    otp: string;
  }

  const [user, setUser] = useState<User>({
    otp: "",
    userId: auth.userId,
  });

  const [errors, setErrors] = useState("");

  useEffect(() => {
    console.log(JSON.stringify(auth.isVerified));
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
  }, [auth.userId, auth.isVerified, auth.role, navigate]);

  const schema = Yup.lazy(() =>
    Yup.object().shape({
      otp: Yup.string()
        .required("otp is required")
        .min(6, "otp must be at least 6 characters")
        .max(6, "otp must be less than 6 characters"),
    })
  );

  const handleVerifyOtp = async () => {
    try {
      await schema.validate(user, { abortEarly: false });
      setErrors(""); // Clear errors if validation passes
      dispatch(verifyOtp(user) as any);
    } catch (validationErrors: any) {
      const firstError = validationErrors.inner[0].message; // Get the first error message
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
                placeholder="Enter otp"
                value={user.otp}
                onChange={(e) => setUser({ ...user, otp: e.target.value })}
              />
            </div>
            <div className="sm:px-[195px] lg:px-[425px] text-red-500">
              {errors && <p>{errors}</p>}
            </div>
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
