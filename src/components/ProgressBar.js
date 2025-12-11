import React from 'react';

const ProgressBar = ({ steps, small = false }) => {
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className={`progress-container ${small ? 'small' : ''}`}>
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <div className="progress-labels">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProgressBar;