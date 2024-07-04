import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ChildProp {
  children: ReactNode;
}

const AdminAuth = ({ children }: ChildProp) => {
  const auth = useSelector((state: any) => state.auth);
  console.log(auth);

  return !auth.userId ? (
    <Navigate to="/student-auth/signin" replace />
  ) : !auth.isVerified ? (
    <Navigate to="/student-auth/otp" replace />
  ) : auth.role !== "admin" ? (
    <Navigate to="/" replace />
  ) : (
    <>{children}</>
  );
};

export default AdminAuth;
