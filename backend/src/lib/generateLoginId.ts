export function generateEmployeeCode(firstName: string, lastName: string, joinYear: number, serial: number): string {
  const f = firstName.slice(0, 2).padEnd(2, 'X');
  const l = lastName.slice(0, 2).padEnd(2, 'X');
  const initials = (f + l).toUpperCase();
  const prefix = process.env.COMPANY_PREFIX ?? 'OI';
  return `${prefix}${initials}${joinYear}${String(serial).padStart(4, '0')}`;
}
