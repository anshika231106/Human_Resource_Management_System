import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { EmployeeCard } from "../components/EmployeeCard";
import { mockEmployees } from "../data/mockEmployees";
import "../styles/Dashboard.css";

interface DashboardPageProps {
  onLogout?: () => void;
}

export const DashboardPage = ({ onLogout }: DashboardPageProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredEmployees = mockEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase())
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
          <button className="new-employee-btn">NEW</button>
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Employee Grid */}
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
      </main>
    </div>
  );
};
