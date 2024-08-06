import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Usercontext } from "./usercontext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(Usercontext);
  console.log(user)
  if (!user) {
    return <Navigate to="/login" />;
  }
  console.log(user)

  return children;
};

export default ProtectedRoute;
