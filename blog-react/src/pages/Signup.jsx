import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Signup({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    emailErr: "",
    passwordErr: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const name = formData.name;
    const email = formData.email;
    const password = formData.password;
    let formErrorTmp = {
      nameErr: "",
      emailErr: "",
      passwordErr: "",
    };

    if (name.length == 0) {
      formErrorTmp.nameErr = "Please enter name";
      isValid = false;
    }

    if (email.length == 0 || !email.includes("@")) {
      formErrorTmp.emailErr = "Please enter valid email";
      isValid = false;
    }

    if (password.length == 0) {
      formErrorTmp.passwordErr = "Please enter password";
      isValid = false;
    }

    setFormErrors({ ...formErrorTmp });

    return isValid;
  };

  const signupRequest = async (event) => {
    event.preventDefault();
    let isValid = validateForm();

    try {
      if (isValid) {
        setLoading(true);
        setError("");
        const response = await fetch(
          "http://localhost:8080/api/v1/auth/signup",
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
          setFormData({ name: "", email: "", password: "" });
          setUser({ ...user, userId: data.data.userId });
          navigate("/signupOTP");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <form className="row mx-auto" onSubmit={(event) => signupRequest(event)}>
        <div className="mb-3 row">
          <label htmlFor="inputName" className="col-sm-12 col-form-label">
            Name
            <sup className="text-danger">
              <strong>*</strong>
            </sup>
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="text"
              className="form-control"
              id="inputName"
              name="name"
              value={formData.name}
              onChange={(event) => handleChange(event)}
            />
          </div>
          <p className="fs-6 fw-semibold text-danger">{formErrors.nameErr}</p>
        </div>
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
          <button type="submit" className="btn btn-primary mb-3">
            Signup
          </button>
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

Signup.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
};

export default Signup;
