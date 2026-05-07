import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, disabled = false }) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="icon-text-button"
        type="button"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={!pagination.hasPrevPage || disabled}
      >
        <ChevronLeft size={17} aria-hidden="true" />
        Previous
      </button>

      <span className="page-count">
        Page {pagination.page} of {pagination.pages}
      </span>

      <button
        className="icon-text-button"
        type="button"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={!pagination.hasNextPage || disabled}
      >
        Next
        <ChevronRight size={17} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
