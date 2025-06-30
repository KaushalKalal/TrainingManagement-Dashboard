import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, logout } from "../services/authService";

const InstructorDashboard = () => {
  // Local state management
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [trainees, setTrainees] = useState([]);
  const [assignedModules, setAssignedModules] = useState({});
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const headers = { Authorization: `Bearer ${getToken()}` };

  // Fetch all available modules
  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/modules", {
        headers,
      });
      setModules(res.data);
    } catch {
      alert("Failed to load modules");
    }
  };

  // Fetch all trainees (users with role "Trainee")
  const fetchTrainees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users?role=Trainee",
        { headers }
      );
      setTrainees(res.data);
    } catch {
      alert("Failed to load trainees");
    }
  };

  // Get module progress (assigned/completed) for each trainee
  const fetchAssignedModules = async () => {
    try {
      const data = {};
      for (const trainee of trainees) {
        const res = await axios.get(
          `http://localhost:5000/api/modules/progress/${trainee._id}`,
          { headers }
        );
        data[trainee._id] = {
          completed: res.data.completed,
          total: res.data.total,
          modules: res.data.modules,
        };
      }
      setAssignedModules(data);
    } catch {
      console.error("Error fetching trainee assignments");
    }
  };

  // Load modules and trainees initially
  useEffect(() => {
    fetchModules();
    fetchTrainees();
  }, []);

  // Re-fetch assignments when trainee list or module list changes
  useEffect(() => {
    if (trainees.length) fetchAssignedModules();
  }, [trainees, modules]);

  // Handle module creation form submission
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/modules", newModule, {
        headers,
      });
      setNewModule({ title: "", description: "" });
      fetchModules();
    } catch {
      console.error("Error creating module");
    }
  };

  // Assign selected module to selected trainee
  const handleDropdownAssign = async () => {
    if (!selectedTrainee || !selectedModule) return;
    try {
      await axios.post(
        "http://localhost:5000/api/modules/assign",
        { traineeId: selectedTrainee, moduleId: selectedModule },
        { headers }
      );
      fetchAssignedModules();
      setSelectedTrainee("");
      setSelectedModule("");
    } catch {
      alert("Failed to assign module");
    }
  };

  // Delete module by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/modules/${id}`, {
        headers,
      });
      setModules((prev) => prev.filter((mod) => mod._id !== id));
    } catch {
      console.error("Error deleting module");
    }
  };

  // Remove assigned module from a specific trainee
  const removeFromTrainee = async (traineeId, moduleId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/modules/unassign`,
        { traineeId, moduleId },
        { headers }
      );
      fetchAssignedModules();
    } catch {
      console.error("Error removing module from trainee");
    }
  };

  return (
    <div className="container py-4">
      {/* Header with user info and logout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary fw-bold">Welcome, {user?.name}</h2>
          <p className="text-muted small">Instructor Dashboard</p>
        </div>
        <button className="btn btn-danger btn-sm px-3 py-2" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="row g-4">
        {/* Create Module Section */}
        <div className="col-md-6">
          <div className="card bg-light border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-dark mb-3">📦 Create Module</h5>
              <form
                onSubmit={handleCreate}
                className="flex-grow-1 d-flex flex-column"
              >
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Module Title"
                  value={newModule.title}
                  onChange={(e) =>
                    setNewModule({ ...newModule, title: e.target.value })
                  }
                  required
                />
                <textarea
                  rows="2"
                  maxLength="200"
                  className="form-control mb-2"
                  placeholder="Module Description"
                  value={newModule.description}
                  onChange={(e) =>
                    setNewModule({ ...newModule, description: e.target.value })
                  }
                  required
                ></textarea>
                <button className="btn btn-primary mt-auto w-100">
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Assign Module Section */}
        <div className="col-md-6">
          <div className="card bg-light border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-dark mb-3">🎯 Assign Module</h5>
              <select
                className="form-select mb-2"
                value={selectedTrainee}
                onChange={(e) => setSelectedTrainee(e.target.value)}
              >
                <option value="">Select Trainee</option>
                {trainees.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <select
                className="form-select mb-2"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
              >
                <option value="">Select Module</option>
                {modules.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary mt-auto w-100"
                onClick={handleDropdownAssign}
              >
                Assign
              </button>
            </div>
          </div>
        </div>

        {/* Trainee Assignment Overview */}
        {trainees.length > 0 && (
          <div className="col-12">
            <div className="card bg-light border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3 text-dark">
                  🧑‍🎓 Trainee Assignments
                </h5>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                  {trainees.map((trainee) => {
                    const data = assignedModules[trainee._id] || {};
                    const modules = data.modules || [];
                    const completed = data.completed || 0;
                    const total = data.total || 0;

                    return (
                      <div className="col" key={trainee._id}>
                        <div className="card bg-white shadow-sm h-auto p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold text-primary mb-0">
                              {trainee.name}
                            </h6>
                            <span className="badge bg-secondary">
                              {completed}/{total}
                            </span>
                          </div>
                          <p className="text-muted small mb-2">
                            {trainee.email}
                          </p>

                          {modules.length > 0 ? (
                            <ul className="list-group list-group-flush small">
                              {modules.map((mod) => (
                                <li
                                  key={mod._id}
                                  className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                  {mod.title}
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() =>
                                      removeFromTrainee(trainee._id, mod._id)
                                    }
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted small fst-italic">
                              No modules assigned
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Modules List */}
        {modules.length > 0 && (
          <div className="col-12">
            <div className="card bg-light border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3 text-dark">📚 All Modules</h5>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                  {modules.map((mod) => (
                    <div className="col" key={mod._id}>
                      <div className="card bg-white border shadow-sm h-100 p-3">
                        <h6 className="fw-bold mb-1">{mod.title}</h6>
                        <p className="text-muted small mb-2">
                          {mod.description || "No description provided"}
                        </p>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(mod._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
