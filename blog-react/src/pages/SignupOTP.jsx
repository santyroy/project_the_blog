import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function SignupOTP({ user }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function signupConfirmWithOTP(event) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(
      `http://localhost:8080/api/v1/auth/signupConfirm/${user.userId}/${otp}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (response.status === 400) {
      setError(data.data);
      setLoading(false);
      setSuccess("");
    } else if (response.status === 500) {
      setError("Something went wrong");
      setLoading(false);
      setSuccess("");
    } else {
      setError("");
      setLoading(false);
      setOtp("");
      navigate("/login");
    }
  }

  async function resendOTP(event) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(
      `http://localhost:8080/api/v1/auth/resendOTP/${user.userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (response.status === 400) {
      setError(data.data);
      setLoading(false);
      setSuccess("");
    } else if (response.status === 401) {
      setError("Unauthorized");
      setLoading(false);
      setSuccess("");
    } else if (response.status === 500) {
      setError("Something went wrong");
      setLoading(false);
      setSuccess("");
    } else {
      setError("");
      setLoading(false);
      setOtp("");
      setSuccess("OTP send successfully, please check you email");
    }
  }

  return (
    <div className="login mt-5 shadow p-4 bg-body-secondary rounded">
      <form
        className="row mx-auto"
        onSubmit={(event) => signupConfirmWithOTP(event)}
      >
        <div className="mb-3 row">
          <label htmlFor="staticOTP" className="col-sm-12 col-form-label">
            Enter OTP
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              type="text"
              maxLength={4}
              className="form-control"
              id="staticOTP"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </div>

        <div className="col-auto">
          <button
            type="submit"
            className={`btn btn-primary mb-3 ${otp.length < 4 && "disabled"}`}
          >
            Submit
          </button>
          <div>
            <Link to={""} onClick={resendOTP}>
              Resend OTP
            </Link>
          </div>
        </div>
        <div className="mt-3">
          {loading && (
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {error && <p className="fs-6 fw-semibold text-danger">{error}</p>}
          {success && (
            <p className="fs-6 fw-semibold text-success">{success}</p>
          )}
        </div>
      </form>
    </div>
  );
}

SignupOTP.propTypes = {
  user: PropTypes.object,
};

export default SignupOTP;
