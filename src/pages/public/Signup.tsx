import React, { useEffect, useState } from "react";
// import googleIcon from "../assets/image/icons8-google-24.png";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "../../components/public/auth/InputForm";
import ButtonForm from "../../components/public/auth/ButtonForm";
import signupImage from "../../assets/signupPage2.png";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/auth/authActions";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Partial<User>>({});

  useEffect(() => {
    if (auth.registerError) {
      toast.error(auth.registerError.error);
    }
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
  }, [auth.userId, auth.isVerified, auth.role, navigate, auth.registerError]);

  const schema = Yup.lazy(() =>
    Yup.object().shape({
      firstName: Yup.string()
        .required("First name is required")
        .min(3, "First name must be at least 3 characters")
        .max(25, "First name must be less than 25 characters"),
      lastName: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .max(25, "Last name must be less than 25 characters"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(25, "Password must be less than 25 characters"),
      // .matches(
      //   /^(?=.*[a-z])(?=.*\d)(?=.*[!#?])[0-9a-zA-Z!#?]{1,}$/,
      //   "Password must contain at least one lowercase letter, one digit, and one special character"
      // )
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .test(
          "confirmPassword",
          "Passwords must match",
          (value, context) =>
            value === context.parent.password || value === undefined
        ),
    })
  );

  const handleSignup = async () => {
    try {
      await schema.validate(user, { abortEarly: false });
      dispatch(registerUser(user) as any);
    } catch (validationErrors: any) {
      const newErrors: Partial<User> = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path as keyof User] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="grid grid-cols-1 min-h-screen lg:grid-cols-2">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[80%] max-w-[350px] p-2">
          {/* <ButtonForm
            nameButton={
              <span className="flex justify-center">
                <span>
                  <img src={googleIcon} alt="Google Icon" className="mr-2" />
                </span>
                Sign Up with Google
              </span>
            }
            tailwindBClass="my-2"
            tailwindBBClass="bg-green-200"
          /> */}
          {/* <div className="text-center font-bold">OR</div>
          <hr className="border-0 h-px bg-gray-300" /> */}
          <h1 className="text-center font-bold text-3xl mb-6">
            Student Signup
          </h1>
          <InputForm
            placeholder="First Name"
            type="text"
            tailwindIClass="mb-4"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            errorMsg={errors.firstName}
          />
          <InputForm
            placeholder="Last Name"
            type="text"
            tailwindIClass="mb-4"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            errorMsg={errors.lastName}
          />
          <InputForm
            placeholder="Email"
            type="email"
            tailwindIClass="mb-4"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            errorMsg={errors.email}
          />
          <InputForm
            placeholder="Password"
            type="password"
            tailwindIClass="mb-4"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            errorMsg={errors.password}
          />
          <InputForm
            placeholder="Confirm Password"
            type="password"
            tailwindIClass="mb-6"
            value={user.confirmPassword}
            onChange={(e) =>
              setUser({ ...user, confirmPassword: e.target.value })
            }
            errorMsg={errors.confirmPassword}
          />
          <ButtonForm
            nameButton="Sign Up"
            tailwindBClass="mb-4"
            tailwindBBClass="bg-green-500 text-white w-full py-2 rounded-md hover:bg-green-600 transition duration-300"
            onClick={handleSignup}
          />
          <p className="text-center">
            Already have an account?{" "}
            <Link
              to="/student-auth/signin"
              className="text-blue-500 hover:underline"
            >
              Sign in now
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full lg:block hidden">
        <img
          src={signupImage}
          alt="Sign Up"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;
