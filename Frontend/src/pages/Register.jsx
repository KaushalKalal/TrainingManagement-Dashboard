import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Trainee",
    instructorCode: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation checks
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.role === "Instructor" && !form.instructorCode.trim()) {
      setError("Instructor security code is required");
      return;
    }

    try {
      const user = await register(form);
      // Redirect to role-specific dashboard after successful registration
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      if (msg.toLowerCase().includes("already exists")) {
        setError("Email is already registered");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="col-md-6 col-lg-5 bg-white p-5 rounded shadow">
        <h2 className="text-center mb-4 text-success">Register</h2>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {form.password.length > 0 && form.password.length < 8 && (
              <small className="text-danger">
                Password must be at least 8 characters
              </small>
            )}
          </div>

          {/* Instructor Code (only shown if Instructor role selected) */}
          {form.role === "Instructor" && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Instructor Security Code"
                  className="form-control"
                  value={form.instructorCode}
                  onChange={(e) =>
                    setForm({ ...form, instructorCode: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <div className="form-control">
                  Instructor Security Code = Kaushal
                  <br />
                  <span className="text-muted small">
                    (can be updated later)
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Display error messages */}
          {error && (
            <div className="mb-3">
              <small className="text-danger d-block text-center">{error}</small>
            </div>
          )}

          {/* Select role: Trainee or Instructor */}
          <div className="mb-4">
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="Trainee">Trainee</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>

          {/* Submit registration */}
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={form.password.length < 8}
          >
            Register
          </button>
        </form>

        {/* Switch to login */}
        <p className="text-center mt-4 mb-0 text-muted">
          Already have an account?{" "}
          <button
            className="btn btn-link text-decoration-none p-0 text-success"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
