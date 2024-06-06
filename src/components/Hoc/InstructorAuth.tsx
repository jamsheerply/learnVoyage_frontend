import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ChildProp {
  children: ReactNode;
}

const InstructorAuth = ({ children }: ChildProp) => {
  const auth = useSelector((state: any) => state.auth);
  console.log(auth);

  return !auth.userId ? (
    <Navigate to="/auth/signin" replace />
  ) : !auth.isVerified ? (
    <Navigate to="/auth/otp" replace />
  ) : auth.role !== "instructor" ? (
    <Navigate to="/" replace />
  ) : (
    <>{children}</>
  );
};

export default InstructorAuth;
