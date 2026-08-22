import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { EmployeeCard } from "../components/EmployeeCard";
import { CreateEmployeeModal } from "../components/CreateEmployeeModal";
import { fetchEmployees } from "../services/dashboardApi";
import type { Employee } from "../types/dashboard.types";
import "../styles/Dashboard.css";
import { loadSession } from "../../auth/services/authApi";

interface DashboardPageProps {
  onLogout?: () => void;
}

export const DashboardPage = ({ onLogout }: DashboardPageProps) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const session = loadSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Employees don't get a company directory — take them straight to their
    // own profile. Only admins see the full employee grid below.
    if (session?.user && !isAdmin) {
      navigate(`/dashboard/employees/${session.user.id}`, { replace: true });
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (session?.user && !isAdmin) {
    return null;
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      (emp.department && emp.department.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/signin");
    }
  };

  const handleViewEmployee = (id: string) => {
    navigate(`/dashboard/employees/${id}`);
  };

  return (
    <div className="dashboard-page">
      <Navbar onLogout={handleLogout} />

      <main className="dashboard-main">
        {/* Toolbar */}
        <div className="dashboard-toolbar">
          {isAdmin && (
            <button className="new-employee-btn" onClick={() => setIsModalOpen(true)}>NEW</button>
          )}
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loading / Error / Employee Grid */}
        {loading ? (
          <div className="empty-state">
            <p>Loading employees from database...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p style={{ color: "#ef4444" }}>{error}</p>
          </div>
        ) : (
          <>
            <div className="employee-grid">
              {filteredEmployees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  employee={emp}
                  selected={selectedIds.has(emp.id)}
                  onSelect={toggleSelect}
                  onView={handleViewEmployee}
                />
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="empty-state">
                <p>No employees found matching "{search}"</p>
              </div>
            )}
          </>
        )}
      </main>

      <CreateEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          loadData();
          setIsModalOpen(false);
        }} 
      />
    </div>
  );
};
