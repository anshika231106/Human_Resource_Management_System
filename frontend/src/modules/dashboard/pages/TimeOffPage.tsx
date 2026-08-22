import { useEffect, useState } from 'react';
import { loadSession } from '../../auth/services/authApi';
import { fetchLeaveBalance, fetchLeaveHistory, createLeaveRequest, approveLeaveRequest, rejectLeaveRequest } from '../services/leaveApi';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import { LeaveRequestCalendar } from '../components/LeaveRequestCalendar';
import { LeaveRequestModal } from '../components/LeaveRequestModal';
import "../styles/Dashboard.css";

export const TimeOffPage = () => {
  const [balances, setBalances] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const session = loadSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  const refreshData = async () => {
    const [bal, hist] = await Promise.all([fetchLeaveBalance(), fetchLeaveHistory()]);
    setBalances(bal);
    setRequests(hist);
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleCreate = async (payload: { type: string; startDate: string; endDate: string; remarks?: string }) => {
    await createLeaveRequest(payload);
    setShowModal(false);
    await refreshData();
  };

  const handleApprove = async (id: string) => {
    await approveLeaveRequest(id);
    await refreshData();
  };

  const handleReject = async (id: string) => {
    await rejectLeaveRequest(id);
    await refreshData();
  };

  return (
    <div className="timeoff-page">
      <h2 className="page-title">Time Off</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <LeaveBalanceCard balances={balances} />
          <button className="btn-new-request" onClick={() => setShowModal(true)}>Request Time Off</button>
          <LeaveRequestCalendar requests={requests} />
          {isAdmin && (
            <div className="admin-actions">
              <h3>Pending Requests</h3>
              {requests.filter(r => r.status === 'PENDING').map(r => (
                <div key={r.id} className="admin-request-item">
                  <span>{r.type} – {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}</span>
                  <button className="btn-approve" onClick={() => handleApprove(r.id)}>Approve</button>
                  <button className="btn-reject" onClick={() => handleReject(r.id)}>Reject</button>
                </div>
              ))}
            </div>
          )}
          {showModal && (
            <LeaveRequestModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreate} />
          )}
        </>
      )}
    </div>
  );
};
