import './LeaveBalanceCard.css';

export const LeaveBalanceCard = ({ balances }: { balances: any[] }) => {
  const get = (type: string) => {
    const b = balances.find((b) => b.type === type);
    return b ? b.paidDays : 0;
  };

  return (
    <div className="leave-balance-card">
      <h3>Leave Balances</h3>
      <div className="balance-grid">
        <div className="balance-item">
          <span className="label">Paid</span>
          <span className="value">{get('PAID')}</span>
        </div>
        <div className="balance-item">
          <span className="label">Sick</span>
          <span className="value">{get('SICK')}</span>
        </div>
        <div className="balance-item">
          <span className="label">Unpaid</span>
          <span className="value">{get('UNPAID')}</span>
        </div>
      </div>
    </div>
  );
};
