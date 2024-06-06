import { useEffect, useState } from "react";
// import googleIcon from "../assets/image/icons8-google-24.png";
import signinImage from "../assets/signinPage2.png";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import ButtonForm from "../components/ButtonForm";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/auth/authActions";

interface User {
  email: string;
  password: string;
  [key: string]: string;
}

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state: any) => state.auth);
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log(JSON.stringify(auth.isVerified));
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

  const handleSignin = () => {
    dispatch(loginUser(user) as any);
  };
  return (
    <div className="grid grid-cols-1 min-h-screen lg:grid-cols-2">
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex-col items-end w-[80%] p-2">
          {/* <ButtonForm
            nameButton={
              <span className="flex justify-center">
                <span>
                  <img src={googleIcon} alt="Google Icon" className="mr-2" />
                </span>
                Sign In with Google
              </span>
            }
            tailwindBClass="my-2"
            tailwindBBClass="bg-green-200"
          /> */}
          {/* <div className="text-center font-bold">OR</div>
          <hr className="border-0 h-px bg-gray-300" /> */}
          <div className="text-center font-bold  text-3xl">
            <h1>Login</h1>
          </div>
          <InputForm
            placeholder="Email"
            type="text"
            tailwindIClass="my-6"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
          <InputForm
            placeholder="Password"
            type="password"
            tailwindIClass="my-2"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
          {/* <div className="sm:px-[195px] lg:px-[130px] ">Forget Password?</div> */}
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
