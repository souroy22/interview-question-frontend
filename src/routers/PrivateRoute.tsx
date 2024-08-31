import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.userReducer);
  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/login" state={{ prevUrl: location.pathname }} />;
};

export default PrivateRoute;
