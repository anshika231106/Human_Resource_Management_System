interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="signup-header">
      <div className="signup-icon">
        <img src="/logo.png" alt="Company logo" className="auth-logo" style={{ width: 480, height: 480, objectFit: 'contain', borderRadius: 12 }} />
      </div>
      <h1 className="signup-title">{title}</h1>
      <p className="signup-subtitle">{subtitle}</p>
    </div>
  );
};
