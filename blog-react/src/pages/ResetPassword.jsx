import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state["email"],
    otp: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOTPToResetPassword(event) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(
      `http://localhost:8080/api/v1/auth/resetPassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await response.json();
    if (response.status === 400) {
      setError(data.data);
      setLoading(false);
    } else if (response.status === 404) {
      setError("User not registered with given email");
      setLoading(false);
    } else if (response.status === 500) {
      setError("Something went wrong");
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
      setForm({ enail: "", otp: "", password: "" });
      navigate("/login");
    }
  }

  return (
    <div className="mt-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
      <form
        className="row mx-auto"
        onSubmit={(event) => sendOTPToResetPassword(event)}
      >
        <div className="mb-3 row">
          <label htmlFor="staticEmail" className="col-sm-12 col-form-label">
            Email
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="email"
              className="form-control"
              id="staticEmail"
              name="email"
              value={form.email}
              disabled
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="staticPassword" className="col-sm-12 col-form-label">
            OTP
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="number"
              className="form-control"
              id="staticPassword"
              name="otp"
              value={form.otp}
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="staticPassword" className="col-sm-12 col-form-label">
            New Password
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="password"
              className="form-control"
              id="staticPassword"
              name="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, [event.target.name]: event.target.value })
              }
            />
          </div>
        </div>

        <div className="col-auto">
          <button type="submit" className={`btn btn-success mb-3 `}>
            Update Password
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

export default ResetPassword;
