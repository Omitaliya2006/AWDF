import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onTaskCreated, onGenerateAi, onToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Om Italiya (24IT029)',
    isAiGenerated: false,
    aiProvider: 'none'
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiDisclaimer, setAiDisclaimer] = useState('');
  const [isFallbackNotice, setIsFallbackNotice] = useState(false);

  const handleGenerateAi = async () => {
    if (!formData.title.trim()) {
      onToast('Please enter a task title first so AI can generate a description', 'error');
      return;
    }

    try {
      setIsAiLoading(true);
      const res = await onGenerateAi(formData.title);

      setFormData(prev => ({
        ...prev,
        description: res.description || prev.description,
        priority: res.suggestedPriority || prev.priority,
        isAiGenerated: true,
        aiProvider: res.provider || 'openai'
      }));

      setAiDisclaimer(res.disclaimer || '⚠️ AI-generated suggestion. Review and modify before saving.');
      setIsFallbackNotice(!!res.fallback);

      if (res.fallback) {
        onToast('AI generated description via local fallback engine', 'info');
      } else {
        onToast('✨ AI description generated successfully via OpenAI', 'success');
      }
    } catch (err) {
      onToast(err.message || 'AI request failed', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      onToast('Task title is required', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onTaskCreated(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'Om Italiya (24IT029)',
        isAiGenerated: false,
        aiProvider: 'none'
      });
      setAiDisclaimer('');
      setIsFallbackNotice(false);
      onToast('Task saved successfully to database', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-card">
      <div className="form-card-header">
        <h4>Create New Task</h4>
        <span className="ai-feature-pill">✨ AI-Powered</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title *</label>
          <div className="title-input-wrapper">
            <input
              type="text"
              placeholder="e.g. Implement bcrypt password hashing for user registration"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <button
              type="button"
              className={`ai-generate-btn ${isAiLoading ? 'loading' : ''}`}
              onClick={handleGenerateAi}
              disabled={isAiLoading || !formData.title.trim()}
              title="Auto-generate description and suggest priority using AI"
            >
              {isAiLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>AI Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Disclaimer & Fallback Notification */}
        {aiDisclaimer && (
          <div className={`ai-disclaimer-banner ${isFallbackNotice ? 'fallback' : 'success'}`}>
            <span className="disclaimer-icon">{isFallbackNotice ? '🛡️' : '✨'}</span>
            <div className="disclaimer-content">
              <strong>{isFallbackNotice ? 'Fallback Engine Response:' : 'AI-Generated Suggestion:'}</strong>
              <p>{aiDisclaimer}</p>
            </div>
          </div>
        )}

        <div className="form-group">
          <div className="label-row">
            <label>Task Description (Editable Suggestion)</label>
            {formData.isAiGenerated && (
              <span className="ai-badge-sm">Editable AI Suggestion</span>
            )}
          </div>
          <textarea
            placeholder="Add detailed task scope or click 'AI Generate' above..."
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Assignee</label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving Task...' : '＋ Save Task to Database'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
