// components/TaskList/TaskPagination.tsx
import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const TaskPagination: React.FC<Props> = ({ currentPage, totalPages, setCurrentPage }) => (
  <nav className="mt-3 d-flex justify-content-center align-items-center gap-3 flex-wrap">
    <button
      className="btn btn-outline-primary"
      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span>Page {currentPage} of {totalPages}</span>
    <button
      className="btn btn-outline-primary"
      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </nav>
);

export default TaskPagination;
