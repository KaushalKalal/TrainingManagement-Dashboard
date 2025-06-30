import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side password validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const user = await login(form);
      // Redirect user to their respective dashboard based on role
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (msg.toLowerCase().includes("user not found")) {
        setError("Email not found");
      } else if (msg.toLowerCase().includes("invalid")) {
        setError("Incorrect password");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-md-6 col-lg-5 bg-white p-5 rounded shadow">
        <h2 className="text-center mb-4 text-success">Login</h2>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
            {form.password.length > 0 && form.password.length < 8 && (
              <small className="text-danger">
                Password must be at least 8 characters
              </small>
            )}
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="mb-3">
              <small className="text-danger d-block text-center">{error}</small>
            </div>
          )}

          {/* Reset Password Link */}
          <div className="text-end mb-3">
            <a
              href="/reset-password"
              className="text-decoration-none text-success small"
            >
              Reset Password
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={form.password.length < 8}
          >
            Login
          </button>
        </form>

        {/* Navigation to Register Page */}
        <div className="text-center mt-4">
          <p className="text-muted mb-0">
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
    </div>
  );
};

export default Login;
