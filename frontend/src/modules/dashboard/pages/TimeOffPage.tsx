import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { loadSession } from '../../auth/services/authApi';
import {
  fetchLeaveBalance,
  fetchLeaveHistory,
  fetchAllLeaveRequests,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
} from '../services/leaveApi';
import { LeaveRequestCalendar } from '../components/LeaveRequestCalendar';
import { LeaveRequestModal } from '../components/LeaveRequestModal';
import '../styles/Dashboard.css';

// ─── Status badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const color =
    status === 'APPROVED'
      ? { bg: 'rgba(52,211,153,0.15)', text: '#34d399', border: 'rgba(52,211,153,0.3)' }
      : status === 'REJECTED'
      ? { bg: 'rgba(248,113,113,0.15)', text: '#f87171', border: 'rgba(248,113,113,0.3)' }
      : { bg: 'rgba(203,106,240,0.15)', text: '#cb6af0', border: 'rgba(203,106,240,0.3)' };

  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
      background: color.bg, color: color.text, border: `1px solid ${color.border}`,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
};

// ─── Type badge ──────────────────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: string }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    PAID:   { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa' },
    SICK:   { bg: 'rgba(251,191,36,0.15)',  text: '#fbbf24' },
    UNPAID: { bg: 'rgba(156,163,175,0.15)', text: '#9ca3af' },
  };
  const c = colors[type] ?? colors.UNPAID;
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
      background: c.bg, color: c.text,
    }}>
      {type === 'PAID' ? 'Paid Time Off' : type === 'SICK' ? 'Sick Leave' : 'Unpaid Leave'}
    </span>
  );
};

// ─── ADMIN VIEW ──────────────────────────────────────────────────────────────
const AdminView = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAllLeaveRequests();
      setRequests(data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    try { await approveLeaveRequest(id); await load(); }
    catch (e: any) { setError(e?.response?.data?.error ?? 'Failed to approve.'); }
  };
  const handleReject = async (id: string) => {
    try { await rejectLeaveRequest(id); await load(); }
    catch (e: any) { setError(e?.response?.data?.error ?? 'Failed to reject.'); }
  };

  const filtered = requests.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = r.employee?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="timeoff-admin">
      {/* Header row */}
      <div className="timeoff-admin-header">
        <h2 className="timeoff-title">Time Off</h2>
        <div className="timeoff-admin-controls">
          <div className="search-wrapper" style={{ width: '220px' }}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text" className="search-input" placeholder="Search employee…"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="timeoff-filter-tabs">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(f => (
          <button key={f} className={`timeoff-filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className="tab-count">
              {f === 'ALL' ? requests.length : requests.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {error && <div className="modal-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <p style={{ color: 'color-mix(in srgb, var(--text-foreground) 40%, transparent)', padding: '40px 0', textAlign: 'center' }}>Loading…</p>
      ) : (
        <div className="timeoff-table-wrap">
          <table className="timeoff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'color-mix(in srgb, var(--text-foreground) 35%, transparent)', padding: '40px 0' }}>No requests found.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-foreground)' }}>{r.employee?.name ?? '—'}</div>
                    <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-foreground) 35%, transparent)', marginTop: '2px' }}>{r.employee?.employeeCode}</div>
                  </td>
                  <td>{new Date(r.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>{new Date(r.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><TypeBadge type={r.type} /></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    {r.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-approve" onClick={() => handleApprove(r.id)}>Approve</button>
                        <button className="btn-reject" onClick={() => handleReject(r.id)}>Reject</button>
                      </div>
                    ) : (
                      <span style={{ color: 'color-mix(in srgb, var(--text-foreground) 25%, transparent)', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── EMPLOYEE VIEW ───────────────────────────────────────────────────────────
const EmployeeView = () => {
  const [balances, setBalances] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [bal, hist] = await Promise.all([fetchLeaveBalance(), fetchLeaveHistory()]);
      setBalances(bal);
      setRequests(hist);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to load time-off data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload: { type: string; startDate: string; endDate: string; remarks?: string }) => {
    try {
      await createLeaveRequest(payload);
      setShowModal(false);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Failed to submit request.');
    }
  };

  const getBalance = (type: 'paidDays' | 'sickDays') => {
    const b = balances[0]; // current year balance
    return b ? Number(b[type]) : 0;
  };

  return (
    <div className="timeoff-employee">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 className="timeoff-title">Time Off</h2>
        <button className="new-employee-btn" onClick={() => setShowModal(true)}>+ New</button>
      </div>

      {error && <div className="modal-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <p style={{ color: 'color-mix(in srgb, var(--text-foreground) 40%, transparent)' }}>Loading…</p>
      ) : (
        <>
          {/* Balance cards */}
          <div className="employee-balance-row">
            <div className="emp-balance-card paid">
              <div className="emp-balance-label">Paid Time Off</div>
              <div className="emp-balance-days">{getBalance('paidDays')} Days Available</div>
            </div>
            <div className="emp-balance-card sick">
              <div className="emp-balance-label">Sick Time Off</div>
              <div className="emp-balance-days">{getBalance('sickDays')} Days Available</div>
            </div>
          </div>

          {/* Calendar */}
          <LeaveRequestCalendar requests={requests} />

          {/* My requests table */}
          {requests.length > 0 && (
            <div className="timeoff-table-wrap" style={{ marginTop: '20px' }}>
              <h3 style={{ color: 'color-mix(in srgb, var(--text-foreground) 60%, transparent)', fontSize: '13px', fontWeight: 500, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>My Requests</h3>
              <table className="timeoff-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td><TypeBadge type={r.type} /></td>
                      <td>{new Date(r.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{new Date(r.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {requests.length === 0 && (
            <div style={{ textAlign: 'center', color: 'color-mix(in srgb, var(--text-foreground) 30%, transparent)', padding: '40px 0', fontSize: '14px' }}>
              No time-off requests yet. Click <strong style={{ color: '#cb6af0' }}>+ New</strong> to submit one.
            </div>
          )}
        </>
      )}

      {showModal && (
        <LeaveRequestModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreate} />
      )}
    </div>
  );
};

// ─── ROOT PAGE ───────────────────────────────────────────────────────────────
export const TimeOffPage = () => {
  const navigate = useNavigate();
  const session = loadSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="dashboard-page">
      <Navbar onLogout={() => navigate('/signin')} />
      <main className="dashboard-main">
        {isAdmin ? <AdminView /> : <EmployeeView />}
      </main>
    </div>
  );
};
