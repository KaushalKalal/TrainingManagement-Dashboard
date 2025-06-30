import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, logout } from "../services/authService";

const TraineeDashboard = () => {
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch trainee's assigned modules and progress stats
  const fetchProgress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/modules/progress/${user._id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setModules(res.data.modules);
      setStats({
        total: res.data.total,
        completed: res.data.completed,
        pending: res.data.pending,
      });
    } catch {
      alert("Failed to load progress");
    }
  };

  // Mark a module as completed
  const handleComplete = async (moduleId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/complete",
        { moduleId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      fetchProgress(); // refresh progress after completion
    } catch {
      alert("Failed to mark module completed");
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-success fw-bold">Welcome, {user?.name}</h2>
          <p className="text-muted">Trainee Dashboard</p>
        </div>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="row text-center mb-5">
        <div className="col-md-4 mb-3">
          <div className="card border-primary h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Modules</h5>
              <h2 className="fw-bold">{stats.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-success h-100">
            <div className="card-body">
              <h5 className="card-title text-success">Completed</h5>
              <h2 className="fw-bold">{stats.completed}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-warning h-100">
            <div className="card-body">
              <h5 className="card-title text-warning">Pending</h5>
              <h2 className="fw-bold">{stats.pending}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Module List Section */}
      <div className="card">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Assigned Modules</h5>
        </div>
        <div className="card-body">
          {modules.length === 0 ? (
            <p className="text-muted">No modules assigned.</p>
          ) : (
            <ul className="list-group">
              {modules.map((mod) => {
                const isCompleted = mod.completedBy.includes(
                  user._id.toString()
                );

                return (
                  <li
                    key={mod._id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div className="me-3">
                      <h6 className="fw-bold mb-1">{mod.title}</h6>
                      <small className="text-muted">
                        {mod.description || "No description provided."}
                      </small>
                    </div>

                    {/* Completion status / button */}
                    {isCompleted ? (
                      <span className="badge bg-success align-self-center">
                        Completed
                      </span>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleComplete(mod._id)}
                      >
                        Mark Completed
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TraineeDashboard;
