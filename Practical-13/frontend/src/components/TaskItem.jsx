import React, { useState } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete, onToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editStatus, setEditStatus] = useState(task.status);

  const handleSave = async () => {
    if (!editTitle.trim()) {
      onToast('Title cannot be empty', 'error');
      return;
    }
    try {
      await onUpdate(task._id, {
        title: editTitle,
        description: editDesc,
        priority: editPriority,
        status: editStatus
      });
      setIsEditing(false);
      onToast('Task updated successfully', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await onUpdate(task._id, { status: nextStatus });
      onToast(`Task marked as ${nextStatus}`, 'success');
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  return (
    <div className={`task-item-card ${task.status}`}>
      {isEditing ? (
        <div className="task-edit-mode">
          <input
            type="text"
            className="edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="edit-textarea"
            rows={3}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
          <div className="edit-controls">
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="edit-btn-group">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="task-top-row">
            <button
              className={`status-circle ${task.status === 'completed' ? 'checked' : ''}`}
              onClick={handleToggleStatus}
              title="Toggle task completion"
            >
              {task.status === 'completed' && '✓'}
            </button>

            <div className="task-heading">
              <h4 className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <div className="task-desc-box">
                  <p className="task-desc-text">{task.description}</p>
                </div>
              )}
            </div>

            <div className="task-badges">
              {task.isAiGenerated && (
                <span className="badge-ai" title={`Generated using ${task.aiProvider || 'AI'}`}>
                  ✨ AI-Assisted
                </span>
              )}
              <span className={`badge-priority ${task.priority}`}>
                {task.priority}
              </span>
              <span className={`badge-status ${task.status}`}>
                {task.status}
              </span>
            </div>
          </div>

          <div className="task-bottom-row">
            <span className="task-author">
              👤 <code>{task.assignedTo || 'Om Italiya (24IT029)'}</code>
            </span>

            <div className="task-action-btns">
              <button className="icon-btn edit" onClick={() => setIsEditing(true)} title="Edit Task">
                ✏️
              </button>
              <button className="icon-btn delete" onClick={() => onDelete(task._id)} title="Delete Task">
                🗑️
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
