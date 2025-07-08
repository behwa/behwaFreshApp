// components/TaskList/TaskTable.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './TaskTable.module.css'; // import CSS modules

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdtime: string;
  createdby: string;
  assignee: string;
}

interface Props {
  tasks: Task[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: (checked: boolean) => void;
  onDelete: (id: string) => void;
  sortField: keyof Task | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Task) => void;
  currentPage: number;
  pageSize: number;
}

const TaskTable: React.FC<Props> = ({
  tasks, selectedIds, toggleSelect, toggleSelectAll, onDelete,
  sortField, sortDirection, onSort, currentPage, pageSize
}) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Helper to check if user is logged in by localStorage presence
  const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    return !!user;
  };

  // Edit button handler
  const handleEditClick = (taskId: string) => {
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
    } else {
      // Redirect to edit page
      window.location.href = `/tasks/edit/${taskId}`;
    }
  };

  // Delete button handler
  const handleDeleteClick = (taskId: string) => {
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
    } else {
      onDelete(taskId);
    }
  };

  return (
    <>
      <table className="table table-bordered table-hover align-middle">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={tasks.length > 0 && tasks.every(t => selectedIds.includes(t.id))}
                onChange={e => toggleSelectAll(e.target.checked)}
              />
            </th>
            <th>No</th>
            <th onClick={() => onSort('title')} style={{ cursor: 'pointer' }}>
              Title {sortField === 'title' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => onSort('description')} style={{ cursor: 'pointer' }}>
              Description {sortField === 'description' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>
              Status {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => onSort('createdtime')} style={{ cursor: 'pointer' }}>
              Created Time {sortField === 'createdtime' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => onSort('createdby')} style={{ cursor: 'pointer' }}>
              Created By {sortField === 'createdby' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => onSort('assignee' as keyof Task)} style={{ cursor: 'pointer' }}>
              Assignee {sortField === 'assignee' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center text-muted">No tasks found.</td>
            </tr>
          ) : (
            tasks.map((task, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index + 1;
              const isSelected = selectedIds.includes(task.id);
              return (
                <tr key={task.id} className={isSelected ? 'table-primary' : ''}>
                  <td
                    onClick={() => toggleSelect(task.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={e => e.stopPropagation()}
                      onChange={() => toggleSelect(task.id)}
                    />
                  </td>

                  <td>{globalIndex}</td>
                  <td>{task.title}</td>
                  <td
                    style={{
                      maxWidth: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={task.description}
                  >
                    {task.description}
                  </td>
                  <td>
                    {task.status === 'Completed' && <span className="badge bg-success">Completed ✅</span>}
                    {task.status === 'In Progress' && <span className="badge bg-info text-dark">In Progress ⏳</span>}
                    {task.status === 'Pending' && <span className="badge bg-warning text-dark">Pending 🕒</span>}
                  </td>
                  <td>
                    {task.createdtime
                      ? new Date(task.createdtime).toLocaleString()
                      : <span className="text-muted">No Date</span>}
                  </td>
                  <td>{task.createdby}</td>
                  <td>{task.assignee || <span className="text-muted">Unassigned</span>}</td>
                  <td>
                    <Link
                      href={`/tasks/${task.id}`}
                      className="btn btn-outline-primary btn-sm me-2"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleEditClick(task.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteClick(task.id)}
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

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <h4>Please login or sign up to continue</h4>
            <div className={styles.modalButtons}>
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
              <Link href="/signup" className="btn btn-secondary">
                Sign Up
              </Link>
            </div>
            <button
              className={`btn btn-link ${styles.modalCancelBtn}`}
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskTable;
