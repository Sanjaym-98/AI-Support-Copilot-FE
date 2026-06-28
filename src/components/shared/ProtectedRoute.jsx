import { useSelector } from "react-redux"
import { useNavigate,Navigate } from "react-router-dom";


const ProtectedRoute =({ children, allowedRoles = [] })=>{
    // const navigate = useNavigate()
const {isAuthenticated,user}= useSelector((store)=>store.auth);
if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;

}


export default ProtectedRoute