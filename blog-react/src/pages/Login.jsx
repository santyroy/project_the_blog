import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { parseJwt } from "../util/JwtUtil";

import PropTypes from "prop-types";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    emailErr: "",
    passwordErr: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const email = formData.email;
    const password = formData.password;
    let formErrorTmp = {
      emailErr: "",
      passwordErr: "",
    };

    if (email.length == 0 || !email.includes("@")) {
      //   setFormErrors((prev) => ({ ...prev, emailErr: "Invalid Email" }));
      formErrorTmp.emailErr = "Invalid Email";
      isValid = false;
    }

    if (password.length == 0) {
      //   setFormErrors((prev) => ({ ...prev, passwordErr: "Invalid Password" }));
      formErrorTmp.passwordErr = "Invalid Password";
      isValid = false;
    }

    setFormErrors({ ...formErrorTmp });

    return isValid;
  };

  const loginRequest = async (event) => {
    event.preventDefault();
    let isValid = validateForm();

    try {
      if (isValid) {
        setLoading(true);
        setError("");
        const response = await fetch(
          "http://localhost:8080/api/v1/auth/login",
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        if (response.status === 401) {
          setError("Unauthorized");
        } else if (response.status === 400) {
          setError("Bad Request");
        } else if (response.status === 500) {
          setError("Something went wrong");
        } else {
          const data = await response.json();
          const token = data.data;
          localStorage.setItem("jwt", token);
          setFormData({ email: "", password: "" });

          // decode JWT and set user details
          const decodedJwt = parseJwt(token);
          const { sub, email, authorities, exp } = decodedJwt;
          setUser({
            userId: sub,
            email: email,
            exp: exp,
            role: authorities[0],
            login: true,
          });
          navigate("/blogs");
        }
      }
    } catch (error) {
      console.log(error.message);
      setError("Server is down");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <form className="row mx-auto" onSubmit={(event) => loginRequest(event)}>
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
            Email
            <sup className="text-danger">
              <strong>*</strong>
            </sup>
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="email"
              className="form-control"
              id="staticEmail"
              placeholder="example@email.com"
              name="email"
              value={formData.email}
              onChange={(event) => handleChange(event)}
            />
          </div>
          <p className="fs-6 fw-semibold text-danger">{formErrors.emailErr}</p>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-12 col-form-label">
            Password
            <sup className="text-danger">
              <strong>*</strong>
            </sup>
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              name="password"
              value={formData.password}
              onChange={(event) => handleChange(event)}
            />
          </div>
          <p className="fs-6 fw-semibold text-danger">
            {formErrors.passwordErr}
          </p>
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-success mb-3">
            Login
          </button>
          <div>
            <Link to={"/forgotPassword"}>Forgot Password?</Link>
          </div>
        </div>
        <div>
          {loading && (
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {error && <p className="fs-6 fw-semibold text-danger">{error}</p>}
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func,
};

export default Login;
