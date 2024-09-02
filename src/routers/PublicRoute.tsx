import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../store/store";

const PublicRoute = () => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.userReducer);

  if (user) {
    return (
      <Navigate
        to={location.state?.prevUrl || "/"}
        state={{ prevUrl: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;
