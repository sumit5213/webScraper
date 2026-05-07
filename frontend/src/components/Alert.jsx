const Alert = ({ children, tone = 'error' }) => (
  <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
    {children}
  </div>
);

export default Alert;
