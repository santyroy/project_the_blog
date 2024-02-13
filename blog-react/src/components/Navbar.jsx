import { NavLink, useNavigate } from "react-router-dom";
import UserIcon from "../assets/user.png";

import PropTypes from "prop-types";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault();
    setUser({ userId: "", email: "", exp: "", role: "", login: false });
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand fs-3 fw-semibold text-uppercase"
          to={"/"}
        >
          The Blog
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to={"/"}>
                Home
              </NavLink>
            </li>

            {user.login && (
              <li className="nav-item">
                <NavLink className="nav-link" to={"/blogs"}>
                  Blogs
                </NavLink>
              </li>
            )}

            {user.login && user.role === "ROLE_ADMIN" && (
              <li className="nav-item">
                <NavLink className="nav-link" to={"/admin"}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {user.login ? (
            <>
              <NavLink
                to={`/profile/${user.userId}`}
                className={"settings-link"}
                title="Profile"
              >
                <img
                  src={UserIcon}
                  alt="user avatar"
                  className="me-3"
                  style={{ width: "32px", height: "32px" }}
                />
                <div className="d-flex flex-column  me-2 mb-2">
                  <small className="fw-semibold">Welcome</small>
                  <small>{user.email}</small>
                </div>
              </NavLink>

              <button
                className="btn btn-outline-danger m-1"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to={"/login"}>
                <button className="btn btn-outline-success mx-1" type="button">
                  Login
                </button>
              </NavLink>
              <NavLink to={"/signup"}>
                <button className="btn btn-outline-primary" type="button">
                  Signup
                </button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};

export default Navbar;
