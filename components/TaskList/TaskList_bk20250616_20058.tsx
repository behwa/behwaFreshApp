import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdtime: string;  // assuming ISO string from backend
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onBulkDelete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination calculations
  const totalPages = Math.ceil(tasks.length / pageSize);
  const sortedTasks = useMemo(() => {
    if (!sortField) return tasks;

    const sorted = [...tasks].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return sortDirection === 'asc'
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      return 0;
    });

    return sorted;
  }, [tasks, sortField, sortDirection]);

  const pagedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTasks.slice(start, start + pageSize);
  }, [sortedTasks, currentPage, pageSize]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const idsOnPage = pagedTasks.map(t => t.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...idsOnPage])));
    } else {
      const idsOnPage = pagedTasks.map(t => t.id);
      setSelectedIds(prev => prev.filter(id => !idsOnPage.includes(id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // CSV export for selected tasks
  const downloadCSV = () => {
    if (selectedIds.length === 0) return;
    const selectedTasks = tasks.filter(t => selectedIds.includes(t.id));
    const headers = ['ID', 'Title', 'Description', 'Completed'];
    const rows = selectedTasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.completed ? 'Yes' : 'No',
    ]);
    const csvContent =
      [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h2 className="mb-4 text-center">Task List</h2>

      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <button
            className="btn btn-danger me-2"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </button>

          <button
            className="btn btn-success"
            onClick={downloadCSV}
            disabled={selectedIds.length === 0}
          >
            Download CSV
          </button>
        </div>

        <div>
          <label className="me-2 fw-semibold">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            className="form-select d-inline-block"
            style={{ width: 'auto' }}
          >
            {[10, 20, 40, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="fw-semibold">
          Selected: {selectedIds.length}
        </div>
      </div>

      <table className="table table-bordered table-hover align-middle">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>
              <input
                type="checkbox"
                id="select-all"
                onChange={e => toggleSelectAll(e.target.checked)}
                checked={
                  pagedTasks.length > 0 &&
                  pagedTasks.every(t => selectedIds.includes(t.id))
                }
                aria-label="Select all tasks on this page"
              />
            </th>
            <th style={{ width: '50px' }}>No</th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('title')}
            >
              Title {sortField === 'title' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('description')}
            >
              Description {sortField === 'description' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th
              style={{ width: '100px', cursor: 'pointer' }}
              onClick={() => handleSort('completed')}
            >
              Status {sortField === 'completed' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th
              style={{ width: '180px', cursor: 'pointer' }}
              onClick={() => handleSort('createdtime')}
            >
              Created Time {sortField === 'createdtime' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th style={{ width: '130px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pagedTasks.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No tasks found.
              </td>
            </tr>
          ) : (
            pagedTasks.map((task, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index + 1;
              const isSelected = selectedIds.includes(task.id);
              console.log('task = ' + JSON.stringify(task))

              return (
                <tr key={task.id} className={isSelected ? 'table-primary' : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(task.id)}
                      id={`select-${task.id}`}
                    />
                  </td>
                  <td>{globalIndex}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    {task.completed ? (
                      <span className="badge bg-success">Completed ✅</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </td>
                  <td>{new Date(task.createdtime).toLocaleString()}</td>
                  <td>
                    <Link
                      to={`/tasks/edit/${task.id}`}
                      className="btn btn-outline-primary btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <nav
        aria-label="Page navigation"
        className="mt-3 d-flex justify-content-center align-items-center gap-3 flex-wrap"
      >
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default TaskList;
