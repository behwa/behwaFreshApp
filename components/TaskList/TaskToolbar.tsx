// components/TaskList/TaskToolbar.tsx
import React from 'react';

interface Props {
  pageSize: number;
  setPageSize: (size: number) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onDownload: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TaskToolbar: React.FC<Props> = ({
  pageSize,
  setPageSize,
  selectedCount,
  onBulkDelete,
  onDownload,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
    <div>
      <button className="btn btn-danger me-2" onClick={onBulkDelete} disabled={selectedCount === 0}>
        Delete Selected
      </button>
      <button className="btn btn-success" onClick={onDownload} disabled={selectedCount === 0}>
        Download CSV
      </button>
    </div>

    <div>
      <label className="me-2 fw-semibold">Rows per page:</label>
      <select
        value={pageSize}
        onChange={e => setPageSize(parseInt(e.target.value))}
        className="form-select d-inline-block"
        style={{ width: 'auto' }}
      >
        {[10, 20, 40, 50].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>

    <div className="fw-semibold">Selected: {selectedCount}</div>

    {/* 🔍 Search Input */}
    <div className="flex-grow-1">
      <input
        type="text"
        className="form-control"
        placeholder="Search by title, description, etc..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>
);

export default TaskToolbar;
