import React, { useState } from 'react';
import { createEmployee } from '../services/dashboardApi';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateEmployeeModal = ({ isOpen, onClose, onSuccess }: CreateEmployeeModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createEmployee(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Employee</h2>
        <p className="modal-subtitle">Login credentials will be generated and emailed automatically.</p>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employee-first-name">First Name <span className="required-mark">*</span></label>
              <input id="employee-first-name" type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="employee-last-name">Last Name <span className="required-mark">*</span></label>
              <input id="employee-last-name" type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="employee-email">Email Address <span className="required-mark">*</span></label>
            <input id="employee-email" type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="employee-phone">Phone Number <span className="required-mark">*</span></label>
            <input id="employee-phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employee-job-title">Job Title <span className="required-mark">*</span></label>
              <input id="employee-job-title" type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="employee-department">Department <span className="required-mark">*</span></label>
              <div className="select-wrapper">
                <select id="employee-department" name="department" required value={formData.department} onChange={handleChange}>
                  <option value="">Select department</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="employee-join-date">Join Date <span className="required-mark">*</span></label>
            <input id="employee-join-date" type="date" name="joinDate" required value={formData.joinDate} onChange={handleChange} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
