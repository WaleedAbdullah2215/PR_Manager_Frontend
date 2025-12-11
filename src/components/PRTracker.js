import React, { useState } from 'react';
import StepPopup from './StepPopup';

const PRTracker = ({ pr, updateStep }) => {
  const [activeStep, setActiveStep] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleStepClick = (step) => {
    setActiveStep(step);
    setShowPopup(true);
  };

  const handleCompleteStep = (comment, file) => {
    updateStep(pr.id, activeStep.id, comment, file);
    setShowPopup(false);
  };

  return (
    <div className="pr-tracker">
      <div className="timeline">
        {pr.steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`timeline-step ${step.completed ? 'completed' : ''} ${index === pr.steps.length - 1 ? 'last' : ''}`}
            onClick={() => handleStepClick(step)}
          >
            <div className="step-marker">
              {step.completed ? '✓' : step.id}
            </div>
            <div className="step-info">
              <h4>{step.name}</h4>
              {step.completedAt && (
                <p className="step-date">Completed: {step.completedAt}</p>
              )}
            </div>
            {index < pr.steps.length - 1 && (
              <div className={`step-connector ${step.completed ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>

      {showPopup && activeStep && (
        <StepPopup
          step={activeStep}
          onClose={() => setShowPopup(false)}
          onComplete={handleCompleteStep}
        />
      )}
    </div>
  );
};

export default PRTracker;