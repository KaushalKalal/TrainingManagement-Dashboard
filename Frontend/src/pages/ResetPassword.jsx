import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  // Form fields
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Success and error states
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    current: "",
    new: "",
  });

  const navigate = useNavigate();

  // Submit password reset request
  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setFieldErrors({ email: "", current: "", new: "" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, currentPassword, newPassword }
      );

      setMessage(res.data.message);
      // Redirect to login after success
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";

      // Show specific field errors based on response
      if (errorMsg.toLowerCase().includes("user not found")) {
        setFieldErrors((prev) => ({ ...prev, email: "Email not found" }));
      } else if (errorMsg.toLowerCase().includes("incorrect password")) {
        setFieldErrors((prev) => ({
          ...prev,
          current: "Incorrect current password",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, new: errorMsg }));
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-md-6 col-lg-5 bg-white p-5 rounded shadow">
        <h2 className="text-center mb-4 text-success">Reset Password</h2>

        <form onSubmit={handleReset}>
          {/* Email input */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <small className="text-danger">{fieldErrors.email}</small>
            )}
          </div>

          {/* Current password */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="Current Password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            {currentPassword.length > 0 && currentPassword.length < 8 && (
              <small className="text-danger">
                Password must be at least 8 characters
              </small>
            )}
            {fieldErrors.current && (
              <small className="text-danger d-block">
                {fieldErrors.current}
              </small>
            )}
          </div>

          {/* New password */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="New Password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {newPassword.length > 0 && newPassword.length < 8 && (
              <small className="text-danger">
                New password must be at least 8 characters
              </small>
            )}
            {fieldErrors.new && (
              <small className="text-danger d-block">{fieldErrors.new}</small>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={currentPassword.length < 8 || newPassword.length < 8}
          >
            Reset Password
          </button>
        </form>

        {/* Success message */}
        {message && (
          <div className="alert alert-success mt-3 text-center">{message}</div>
        )}

        {/* Navigation link */}
        <p className="text-center mt-4 text-muted">
          Don’t have an account?{" "}
          <button
            className="btn btn-link text-decoration-none p-0 text-success"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
