import { LoaderCircle } from 'lucide-react';

const LoadingState = ({ label = 'Loading' }) => (
  <div className="loading-state" role="status">
    <LoaderCircle className="spin" size={22} aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default LoadingState;
