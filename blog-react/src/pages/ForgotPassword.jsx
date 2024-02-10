import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function sendOTPToResetPassword(event) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(
      `http://localhost:8080/api/v1/auth/forgetPassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
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
      setEmail("");
      navigate("/resetPassword", { state: { email: email } });
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="col-auto">
          <button type="submit" className={`btn btn-success mb-3 `}>
            Send OTP
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

export default ForgotPassword;
