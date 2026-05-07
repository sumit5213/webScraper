const EmptyState = ({ title, children }) => (
  <section className="empty-state">
    <h2>{title}</h2>
    <p>{children}</p>
  </section>
);

export default EmptyState;
