import axios from "axios";

const API = "http://localhost:5000/api/auth";

/**
 * Register a new user (Trainee or Instructor)
 * @param {Object} userData - { name, email, password, role, instructorCode (optional) }
 */
export const register = async (userData) => {
  const res = await axios.post(`${API}/register`, userData);

  if (res.data && res.data.token && res.data.role) {
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } else {
    throw new Error("Invalid registration response");
  }
};

/**
 * Login an existing user
 * @param {Object} userData - { email, password }
 */
export const login = async (userData) => {
  const res = await axios.post(`${API}/login`, userData);

  if (res.data && res.data.token && res.data.role) {
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } else {
    throw new Error("Invalid login response");
  }
};

/**
 * Logout current user and redirect to login
 */
export const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login"; // 👈 reload to reset state globally
};

/**
 * Get JWT token for authenticated requests
 * @returns {string} token
 */
export const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token || "";
};
