import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Usercontext } from "./usercontext";
import { Oval } from 'react-loader-spinner';


const ProtectedRoute = ({ children }) => {
  const { user, ready } = useContext(Usercontext);  
  console.log(user)
  if (!ready) {
    return  <div className="spinner-container">
    <Oval
        height={80}
        width={80}
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
    />
</div>
}
console.log(user)
  if (!user) {
    return <Navigate to="/login" />;
  }
  console.log(user)

  return children;
};

export default ProtectedRoute;
