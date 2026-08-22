import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { fetchEmployeeById } from "../services/dashboardApi";
import { loadSession } from "../../auth/services/authApi";
import type { Employee } from "../types/dashboard.types";
import "../styles/Dashboard.css";

const getInitials = (name: string) => name.split(" ").map((part) => part[0]).join("").toUpperCase();

const Detail = ({ label, value }: { label: string; value?: string }) => (
  <div className="profile-detail">
    <span>{label}</span>
    <strong>{value || "Not provided"}</strong>
  </div>
);

export const EmployeeProfilePage = ({ onLogout }: { onLogout?: () => void }) => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const session = loadSession();
  const isEmployeeProfile = session?.user.role === "EMPLOYEE";
  const isAdmin = session?.user.role === "ADMIN";
  const [activeTab, setActiveTab] = useState<"resume" | "personal" | "salary" | "security">("resume");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;
    fetchEmployeeById(employeeId)
      .then((data) => {
        setEmployee(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [employeeId]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar onLogout={onLogout} />
        <main className="dashboard-main profile-not-found">
          <p>Loading employee profile from database...</p>
        </main>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="dashboard-page">
        <Navbar onLogout={onLogout} />
        <main className="dashboard-main profile-not-found">
          <p>{isEmployeeProfile ? "My profile was not found." : "Employee not found."}</p>
          {!isEmployeeProfile && <button className="profile-back-btn" onClick={() => navigate("/dashboard")}>Back to employees</button>}
        </main>
      </div>
    );
  }

  const hue = employee.name.split("").reduce((total, character) => total + character.charCodeAt(0), 0) % 360;
  const monthlyWage = employee.basicSalary || 0;
  const basicSalary = monthlyWage * 0.5;
  const hra = basicSalary * ((employee.hraPercent || 0) / 100);
  const components = [
    { name: "Basic salary", amount: basicSalary, rate: 50, description: "Basic wage component calculated from the monthly wage." },
    { name: "House rent allowance", amount: hra, rate: employee.hraPercent || 0, description: "HRA calculated as a percentage of the basic salary." },
    { name: "Standard allowance", amount: monthlyWage * 0.0833, rate: 8.33, description: "Fixed monthly allowance provided to the employee." },
    { name: "Performance bonus", amount: monthlyWage * 0.0833, rate: 8.33, description: "Variable allowance based on the employee's performance." },
    { name: "Leave travel allowance", amount: monthlyWage * 0.0833, rate: 8.33, description: "Travel allowance calculated as a percentage of basic salary." },
    { name: "Fixed allowance", amount: monthlyWage * 0.1167, rate: 11.67, description: "Fixed allowance after other salary components are calculated." },
  ];
  const employeePf = basicSalary * ((employee.pfPercent || 0) / 100);
  const employerPf = basicSalary * ((employee.pfPercent || 0) / 100);
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="dashboard-page">
      <Navbar onLogout={onLogout} />
      <main className="dashboard-main employee-profile">
        {!isEmployeeProfile && (
          <button className="profile-back-btn" onClick={() => navigate("/dashboard")} aria-label="Back to employees">
            <span aria-hidden="true">←</span> Employees
          </button>
        )}

        <div className="profile-titlebar"><h1>{isEmployeeProfile ? "My Profile" : "Employee Profile"}</h1><span>{isEmployeeProfile ? "Personal record" : "Employee record"}</span></div>
        <header className="profile-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar" style={{ background: `hsl(${hue}, 30%, 22%)`, color: `hsl(${hue}, 50%, 65%)` }}>
              {employee.avatar ? <img src={employee.avatar} alt={employee.name} /> : getInitials(employee.name)}
            </div>
            <button className="profile-edit-btn" type="button" aria-label="Edit profile picture">✎</button>
          </div>
          <div>
            <h1>{employee.name}</h1>
            <p className="profile-role">{employee.role} · {employee.department}</p>
          </div>
          <div className="profile-header-details">
            <Detail label="Company" value="StaffControl" />
            <Detail label="Department" value={employee.department} />
            <Detail label="Manager" value={employee.manager} />
            <Detail label="Location" value={employee.address} />
          </div>
        </header>

        <nav className="profile-tabs" aria-label="Employee profile sections">
          <button className={activeTab === "resume" ? "active" : ""} onClick={() => setActiveTab("resume")}>Resume</button>
          <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>Private Info</button>
          <button className={activeTab === "salary" ? "active" : ""} onClick={() => setActiveTab("salary")}>Salary Info</button>
          <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>Security</button>
        </nav>

        <div className="profile-sections">
          {activeTab === "resume" && <section className="profile-section profile-resume-section" id="resume">
            <div className="profile-section-heading"><h2>Resume</h2><span>01</span></div>
            <div className="resume-columns">
              <div><h3>About</h3><p className="profile-copy">Professional profile and work information for {employee.name}.</p><h3>What I love about my job</h3><p className="profile-copy">Building useful products, collaborating with the team, and solving meaningful problems.</p></div>
              <div><h3>Skills</h3><p className="profile-tags"><span>{employee.role}</span><span>{employee.department}</span><span>Teamwork</span></p><h3>Certification</h3><p className="profile-muted">No certifications added.</p></div>
            </div>
          </section>}

          {activeTab === "personal" && <>
            <section className="profile-section profile-personal-section" id="personal">
              <div className="profile-section-heading"><h2>Private Info</h2><span>02</span></div>
              <div className="profile-detail-grid">
                <Detail label="Full name" value={employee.name} />
                <Detail label="Employee code" value={employee.employeeCode} />
                <Detail label="Email" value={employee.email} />
                <Detail label="Phone" value={employee.phone} />
                <Detail label="Address" value={employee.address} />
              </div>
            </section>

            <section className="profile-section" id="job">
              <div className="profile-section-heading"><h2>Job details</h2><span>03</span></div>
              <div className="profile-detail-grid">
                <Detail label="Job title" value={employee.role} />
                <Detail label="Department" value={employee.department} />
                <Detail label="Manager" value={employee.manager} />
                <Detail label="Joining date" value={employee.joinDate} />
                <Detail label="Status" value={employee.status || "Active"} />
              </div>
            </section>
            <section className="profile-section" id="documents">
              <div className="profile-section-heading"><h2>Documents</h2><span>04</span></div>
              <div className="profile-documents">
                {(employee.documents || []).length > 0 ? employee.documents?.map((document) => (
                  <div className="profile-document" key={document.name}>
                    <div><strong>{document.name}</strong><span>Uploaded {document.uploadedAt}</span></div>
                    <button type="button" aria-label={`View ${document.name}`}>View</button>
                  </div>
                )) : <p className="profile-muted">No documents uploaded.</p>}
              </div>
            </section>
          </>}

          {activeTab === "salary" && <section className="profile-section profile-salary-section" id="salary">
            <div className="profile-section-heading"><h2>Salary Info</h2><span>ADMIN ONLY</span></div>
            <div className="salary-wage-grid">
              <Detail label="Monthly wage" value={formatCurrency(monthlyWage)} />
              <Detail label="Yearly wage" value={formatCurrency(monthlyWage * 12)} />
              <Detail label="Working days per week" value="5 days" />
              <Detail label="Break time" value="1 hour / day" />
            </div>
            <div className="salary-columns">
              <div>
                <h3>Salary components</h3>
                {components.map((component) => <div className="salary-row" key={component.name}>
                  <div><strong>{component.name}</strong><span>{component.description}</span></div>
                  <b>{formatCurrency(component.amount)} <small>/ month</small></b>
                  <em>{component.rate.toFixed(2)}%</em>
                </div>)}
              </div>
              <div>
                <h3>Provident fund (PF) contribution</h3>
                <div className="salary-row"><div><strong>Employee</strong><span>PF calculated based on basic salary</span></div><b>{formatCurrency(employeePf)} <small>/ month</small></b><em>{employee.pfPercent || 0}%</em></div>
                <div className="salary-row"><div><strong>Employer</strong><span>Employer contribution based on basic salary</span></div><b>{formatCurrency(employerPf)} <small>/ month</small></b><em>{employee.pfPercent || 0}%</em></div>
                <h3 className="salary-subheading">Tax deductions</h3>
                <div className="salary-row"><div><strong>Professional tax</strong><span>Professional tax deducted from gross salary</span></div><b>₹200 <small>/ month</small></b><em>Fixed</em></div>
              </div>
            </div>
          </section>}

          {activeTab === "security" && <section className="profile-section profile-security-section" id="security">
            <div className="profile-section-heading"><h2>Security</h2><span>05</span></div>
            <div className="profile-detail-grid">
              <Detail label="Login ID" value={employee.email} />
              <Detail label="Account status" value="Active" />
            </div>
            {!isAdmin && (
              <>
                <div className="security-divider" />
                <h3 className="security-heading">Change password</h3>
                <form className="security-form" onSubmit={(event) => event.preventDefault()}>
                  <label>Current password<input type="password" placeholder="Enter current password" /></label>
                  <label>New password<input type="password" placeholder="Enter new password" /></label>
                  <label>Confirm password<input type="password" placeholder="Confirm new password" /></label>
                  <button type="submit" className="security-save-btn">Update password</button>
                </form>
              </>
            )}
          </section>}

        </div>
      </main>
    </div>
  );
};

export type EmployeeProfile = Employee;
