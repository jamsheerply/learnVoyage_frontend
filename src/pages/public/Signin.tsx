import React from "react";
import { useEffect, useState } from "react";
import signinImage from "../../assets/signinPage2.png";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "../../components/public/auth/InputForm";
import ButtonForm from "../../components/public/auth/ButtonForm";
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
        <div className="flex-col items-end w-[80%] p-2">
          <div className="text-center font-bold text-3xl">
            <h1>Login</h1>
          </div>
          <InputForm
            placeholder="Email"
            type="text"
            tailwindIClass="my-2"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
          {errors.email && (
            <div className="text-red-500 mx-[125px]">{errors.email}</div>
          )}
          <InputForm
            placeholder="Password"
            type="password"
            tailwindIClass="my-2"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
          {errors.password && (
            <div className="text-red-500 mx-[125px]">{errors.password}</div>
          )}
          <ButtonForm
            nameButton="Sign In"
            tailwindBClass="my-2"
            tailwindBBClass="bg-green-600 text-white"
            onClick={handleSignin}
          />
          <div className="sm:px-[195px] lg:px-[130px] ">
            Don't have an account,
            <Link to="/student-auth/signup" className="text-blue-400">
              Signup now ?
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full lg:block hidden">
        <img src={signinImage} alt="Sign In" className="my-[60px]" />
      </div>
    </div>
  );
};

export default Signin;
