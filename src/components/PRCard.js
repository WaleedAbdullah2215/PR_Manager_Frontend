import React from 'react';
import ProgressBar from './ProgressBar';

const PRCard = ({ pr, onClick, onClone }) => {
  const completedSteps = pr.steps.filter(step => step.completed).length;
  const totalSteps = pr.steps.length;

  return (
    <div className="pr-card" onClick={onClick}>
      <div className="pr-card-header">
        <h3>{pr.prId}</h3>
        <span className={`status-badge ${pr.completed ? 'completed' : 'in-progress'}`}>
          {pr.completed ? 'Completed' : 'In Progress'}
        </span>
      </div>
      
      <p className="pr-description">{pr.description}</p>
      
      <div className="pr-meta">
        <span className="date">Created: {pr.createdAt}</span>
        <span className="progress">
          {completedSteps}/{totalSteps} steps
        </span>
      </div>
      
      <ProgressBar steps={pr.steps} small />
      
      <div className="pr-actions">
        <button 
          className="btn small" 
          onClick={(e) => {
            e.stopPropagation();
            onClone();
          }}
        >
          Clone PR
        </button>
      </div>
    </div>
  );
};

export default PRCard;