import './LeaveRequestCalendar.css';
import { useMemo } from 'react';

export const LeaveRequestCalendar = ({ requests }: { requests: any[] }) => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const weeks = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startIdx = firstDay.getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (null | { date: Date; request?: any })[] = [];
    for (let i = 0; i < startIdx; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const request = requests.find(
        (r) => new Date(r.startDate) <= date && date <= new Date(r.endDate)
      );
      cells.push({ date, request });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    const weekArr = [];
    for (let i = 0; i < cells.length; i += 7) {
      weekArr.push(cells.slice(i, i + 7));
    }
    return weekArr;
  }, [year, month, requests]);

  const monthName = today.toLocaleString('default', { month: 'long' });

  return (
    <div className="leave-calendar">
      <h3>{monthName} {year}</h3>
      <table>
        <thead>
          <tr>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((cell, ci) => (
                <td key={ci} className={cell?.request ? 'has-request' : ''}>
                  {cell?.date?.getDate() ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
