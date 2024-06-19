import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { logoutUser } from "../../store/auth/authSlice";
import { isBlockedApi } from "../../store/api/AuthApi";

interface ChildProp {
  children: ReactNode;
}

const InstructorAuth = ({ children }: ChildProp) => {
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  // Use the useLocation hook to listen to route changes

  const [isBlockedUser, setIsBlockedUser] = useState<boolean | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfBlocked = async () => {
      if (auth.userId) {
        try {
          const result = await isBlockedApi(auth.userId);
          const data = result.data.data;
          setIsBlockedUser(data);
        } catch (error) {
          console.error("Error checking if user is blocked:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkIfBlocked();
  }, [auth.userId, location.pathname]);

  useEffect(() => {
    if (isBlockedUser) {
      dispatch(logoutUser());
    }
  }, [isBlockedUser, dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!auth.userId) {
    return <Navigate to="/student-auth/signin" replace />;
  }

  if (!auth.isVerified) {
    return <Navigate to="/student-auth/otp" replace />;
  }

  if (auth.role !== "instructor") {
    return <Navigate to="/" replace />;
  }

  return isBlockedUser ? null : <>{children}</>;
};

export default InstructorAuth;
