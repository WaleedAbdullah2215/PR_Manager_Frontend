import React, { useState } from 'react';
import CreatePRModal from './CreatePRModal';
import PRTracker from './PRTracker';
import PRCard from './PRCard';
import ProgressBar from './ProgressBar';

const PRDashboard = ({
  prs,
  activePR,
  setActivePR,
  showCreateModal,
  setShowCreateModal,
  createPR,
  updateStep,
  markAllStepsDone,
  jumpToStep,
  createFromTemplate,
  darkMode,
  toggleDarkMode,
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredPRs = prs.filter(pr => {
    if (filter === 'all') return true;
    if (filter === 'completed') return pr.completed;
    if (filter === 'in-progress') return !pr.completed;
    return true;
  });

  const sortedPRs = [...filteredPRs].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'id') return a.prId.localeCompare(b.prId);
    return 0;
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>PR Flow Manager</h1>
        <div className="controls">
          <button className="btn primary" onClick={() => setShowCreateModal(true)}>
            Create New PR
          </button>
          <button className="btn secondary" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All PRs</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date Created</option>
            <option value="id">PR ID</option>
          </select>
        </div>
      </div>

      {showCreateModal && (
        <CreatePRModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createPR}
        />
      )}

      {activePR ? (
        <div className="pr-detail-view">
          <button className="btn back" onClick={() => setActivePR(null)}>
            ← Back to Dashboard
          </button>
          <h2>PR: {activePR.prId}</h2>
          <p>{activePR.description}</p>
          
          <div className="quick-actions">
            <button className="btn" onClick={() => markAllStepsDone(activePR.id)}>
              Mark All Done
            </button>
            <select 
              className="jump-to-select"
              onChange={(e) => jumpToStep(activePR.id, parseInt(e.target.value))}
              value=""
            >
              <option value="" disabled>Jump to Step...</option>
              {activePR.steps.map(step => (
                <option key={step.id} value={step.id}>
                  Step {step.id}: {step.name}
                </option>
              ))}
            </select>
          </div>

          <ProgressBar steps={activePR.steps} />
          <PRTracker 
            pr={activePR} 
            updateStep={updateStep}
          />
        </div>
      ) : (
        <div className="pr-grid">
          {sortedPRs.length > 0 ? (
            sortedPRs.map(pr => (
              <PRCard
                key={pr.id}
                pr={pr}
                onClick={() => setActivePR(pr)}
                onClone={() => createFromTemplate(pr.id)}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No PRs found. Create your first PR to get started!</p>
              <button className="btn primary" onClick={() => setShowCreateModal(true)}>
                Create New PR
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PRDashboard;