import React from "react";
import { useEffect, useState } from "react";
import signinImage from "../../assets/signinPage2.png";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "../../components/public/auth/InputForm";
// import ButtonForm from "../../components/public/auth/ButtonForm";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth/authActions";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";
import * as Yup from "yup";

interface User {
  email: string;
  password: string;
  [key: string]: string;
}

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<User>>({});

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password must be less than 25 characters"),
  });

  useEffect(() => {
    if (auth.userId && !auth.isVerified) {
      navigate("/student-auth/otp");
    } else if (auth.userId && auth.isVerified) {
      if (auth.role === "student") {
        navigate("/student/overview");
      } else if (auth.role === "instructor") {
        navigate("/instructor/overview");
      } else if (auth.role === "admin") {
        navigate("/admin/overview");
      }
    }
  }, [auth.userId, auth.isVerified, auth.role, navigate]);

  const handleSignin = async () => {
    try {
      await schema.validate(user, { abortEarly: false });
      await dispatch(loginUser(user) as any);
    } catch (validationErrors: any) {
      const newErrors: Partial<User> = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path as keyof User] = error.message;
      });
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (auth.loginError) {
      toast.error(auth.loginError.error);
    }
  }, [auth.loginError]);

  return (
    <div className="grid grid-cols-1 min-h-screen lg:grid-cols-2">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[80%] max-w-md p-2">
          <h1 className="text-center font-bold text-3xl mb-6">Login</h1>
          <div className="w-full max-w-[350px] mx-auto">
            {/* Adjust max-width here */}
            <InputForm
              placeholder="Email"
              type="text"
              tailwindIClass="mb-4"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              errorMsg={errors.email}
            />
            <InputForm
              placeholder="Password"
              type="password"
              tailwindIClass="mb-6"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              errorMsg={errors.password}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300 mb-4"
              onClick={handleSignin}
            >
              Sign In
            </button>
          </div>
          <p className="text-center">
            Don't have an account,{" "}
            <Link
              to="/student-auth/signup"
              className="text-blue-500 hover:underline"
            >
              Signup now ?
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full lg:block hidden">
        <img
          src={signinImage}
          alt="Sign In"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signin;
