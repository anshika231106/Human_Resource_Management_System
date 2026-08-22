import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    type: string;
    startDate: string;
    endDate: string;
    remarks?: string;
  }) => void;
}

export const LeaveRequestModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [type, setType] = useState('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!startDate || !endDate) { setError('Please select both dates.'); return; }
    if (new Date(endDate) < new Date(startDate)) { setError('End date must be after start date.'); return; }
    onSubmit({ type, startDate, endDate, remarks: remarks || undefined });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Request Time Off</h2>
        <p className="modal-subtitle">Select dates and type, then submit for admin approval.</p>
        {error && <div className="modal-error">{error}</div>}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="PAID">Paid</option>
              <option value="SICK">Sick</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Remarks (optional)</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '14px', resize: 'vertical' }}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};
