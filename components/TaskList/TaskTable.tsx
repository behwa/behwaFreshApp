// components/TaskList/TaskTable.tsx
import React from 'react';
import Link from 'next/link';

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
}) => (
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
          <td colSpan={8} className="text-center text-muted">No tasks found.</td>
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
                  onClick={e => e.stopPropagation()} // Prevent double toggle when checkbox is clicked
                  onChange={() => toggleSelect(task.id)} // Still handle change when user clicks checkbox directly
                />
              </td>

              <td>{globalIndex}</td>
              <td>{task.title}</td>
              <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={task.description}>
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
                <Link href={`/tasks/view/${task.id}`} className="btn btn-outline-primary btn-sm me-2">
                  View
                </Link>
                <Link href={`/tasks/edit/${task.id}`} className="btn btn-outline-primary btn-sm me-2">
                  Edit
                </Link>
                <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(task.id)}>Delete</button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
);

export default TaskTable;
