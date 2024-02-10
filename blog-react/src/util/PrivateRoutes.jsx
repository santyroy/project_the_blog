import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRoutes({ user, setUser }) {
  const diff = user.exp - Date.now() / 1000;

  useEffect(() => {
    if (diff < 0) {
      localStorage.removeItem("jwt");
      setUser({ userId: "", email: "", exp: "", role: "", login: false });
    }
  });

  return user.login && diff > 0 ? <Outlet /> : <Navigate to={"/login"} />;
}

PrivateRoutes.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};

export default PrivateRoutes;
