import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { loadSession } from "../../auth/services/authApi";
import "../styles/Dashboard.css";

export const AdminProfilePage = () => {
  const session = loadSession();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"resume" | "personal" | "salary" | "security">("resume");

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  const { user } = session;
  const displayName = user.name || "Administrator";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main employee-profile">
        <button className="profile-back-btn" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
          <span aria-hidden="true">←</span> Dashboard
        </button>

        <div className="profile-titlebar">
          <h1>My Profile</h1>
          <span>Administrator record</span>
        </div>

        <header className="profile-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar admin-profile-avatar">{initials}</div>
          </div>
          <div>
            <h1>{displayName}</h1>
            <p className="profile-role">{user.jobTitle || "Administrator"}{user.department ? ` · ${user.department}` : ""}</p>
          </div>
          <div className="profile-header-details">
            <div className="profile-detail"><span>Company</span><strong>StaffControl</strong></div>
            <div className="profile-detail"><span>Department</span><strong>{user.department || "Not provided"}</strong></div>
            <div className="profile-detail"><span>Manager</span><strong>Not assigned</strong></div>
            <div className="profile-detail"><span>Location</span><strong>Not provided</strong></div>
          </div>
        </header>

        <nav className="profile-tabs" aria-label="Profile sections">
          <button className={activeTab === "resume" ? "active" : ""} onClick={() => setActiveTab("resume")}>Resume</button>
          <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>Private Info</button>
          <button className={activeTab === "salary" ? "active" : ""} onClick={() => setActiveTab("salary")}>Salary Info</button>
          <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>Security</button>
        </nav>

        <div className="profile-sections admin-profile-sections">
          {activeTab === "resume" && <section className="profile-section profile-resume-section">
            <div className="profile-section-heading"><h2>Resume</h2><span>01</span></div>
            <div className="resume-columns">
              <div><h3>About</h3><p className="profile-copy">Administrator profile and workspace information for {displayName}.</p><h3>What I love about my job</h3><p className="profile-copy">Supporting the team, improving processes, and building a better workplace.</p></div>
              <div><h3>Skills</h3><p className="profile-tags"><span>Leadership</span><span>People operations</span><span>Teamwork</span></p><h3>Certification</h3><p className="profile-muted">No certifications added.</p></div>
            </div>
          </section>}

          {activeTab === "personal" && <>
            <section className="profile-section">
              <div className="profile-section-heading"><h2>Private Info</h2><span>02</span></div>
              <div className="profile-detail-grid">
                <div className="profile-detail"><span>Full name</span><strong>{displayName}</strong></div>
                <div className="profile-detail"><span>Email</span><strong>{user.email}</strong></div>
                <div className="profile-detail"><span>Phone</span><strong>Not provided</strong></div>
                <div className="profile-detail"><span>Address</span><strong>Not provided</strong></div>
              </div>
            </section>
            <section className="profile-section">
              <div className="profile-section-heading"><h2>Job details</h2><span>03</span></div>
              <div className="profile-detail-grid">
                <div className="profile-detail"><span>Job title</span><strong>{user.jobTitle || "Administrator"}</strong></div>
                <div className="profile-detail"><span>Department</span><strong>{user.department || "Not provided"}</strong></div>
                <div className="profile-detail"><span>Account type</span><strong>Administrator</strong></div>
                <div className="profile-detail"><span>Status</span><strong>Active</strong></div>
              </div>
            </section>
          </>}

          {activeTab === "salary" && <section className="profile-section profile-salary-section">
            <div className="profile-section-heading"><h2>Salary Info</h2><span>ADMIN ONLY</span></div>
            <div className="salary-wage-grid">
              <div className="profile-detail"><span>Monthly wage</span><strong>Not configured</strong></div>
              <div className="profile-detail"><span>Yearly wage</span><strong>Not configured</strong></div>
              <div className="profile-detail"><span>Working days per week</span><strong>Not configured</strong></div>
              <div className="profile-detail"><span>Break time</span><strong>Not configured</strong></div>
            </div>
            <div className="salary-columns">
              <div>
                <h3>Salary components</h3>
                <div className="salary-row"><div><strong>Basic salary</strong><span>No salary structure is assigned to this administrator account.</span></div><b>Not configured</b><em>—</em></div>
              </div>
              <div>
                <h3>Provident fund (PF) contribution</h3>
                <div className="salary-row"><div><strong>Employee</strong><span>PF contribution details are not configured.</span></div><b>Not configured</b><em>—</em></div>
                <div className="salary-row"><div><strong>Employer</strong><span>Employer contribution details are not configured.</span></div><b>Not configured</b><em>—</em></div>
              </div>
            </div>
          </section>}

          {activeTab === "security" && <section className="profile-section profile-security-section">
            <div className="profile-section-heading"><h2>Security</h2><span>04</span></div>
            <div className="profile-detail-grid">
              <div className="profile-detail"><span>Login ID</span><strong>{user.email}</strong></div>
              <div className="profile-detail"><span>Account status</span><strong>Active</strong></div>
            </div>
            <div className="security-divider" />
            <h3 className="security-heading">Change password</h3>
            <form className="security-form" onSubmit={(event) => event.preventDefault()}>
              <label>Current password<input type="password" placeholder="Enter current password" /></label>
              <label>New password<input type="password" placeholder="Enter new password" /></label>
              <label>Confirm password<input type="password" placeholder="Confirm new password" /></label>
              <button type="submit" className="security-save-btn">Update password</button>
            </form>
          </section>}
        </div>
      </main>
    </div>
  );
};
