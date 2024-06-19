import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isBlocked } from "../../store/auth/authActions";
import { RootState, AppDispatch } from "../../store/store"; // Adjust the import path according to your project structure
import { logoutUser } from "../../store/auth/authSlice"; // Ensure this action is defined in your auth actions

interface ChildProp {
  children: ReactNode;
}

const IsBlockedAuth = ({ children }: ChildProp) => {
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [isBlockedUser, setIsBlockedUser] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIfBlocked = async () => {
      if (auth.userId) {
        const result = await dispatch(isBlocked(auth.userId)).unwrap();
        setIsBlockedUser(result);
      }
    };

    checkIfBlocked();
  }, [auth.userId, dispatch]);

  useEffect(() => {
    if (isBlockedUser) {
      dispatch(logoutUser());
    }
  }, [isBlockedUser, dispatch]);

  if (isBlockedUser === null) {
    return null; // or a loading spinner
  }

  return !isBlockedUser ? <>{children}</> : null;
};

export default IsBlockedAuth;
