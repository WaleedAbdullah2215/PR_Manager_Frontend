import React, { useState } from 'react';

const StepPopup = ({ step, onClose, onComplete }) => {
  const [comment, setComment] = useState(step.comment || '');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = () => {
    onComplete(comment, file);
  };

  return (
    <div className="popup-overlay">
      <div className="step-popup">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Step {step.id}: {step.name}</h3>
        <p>{step.description}</p>
        
        <div className="form-group">
          <label>Comments:</label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any comments about this step..."
          />
        </div>
        
        <div className="form-group">
          <label>Attach File:</label>
          <input type="file" onChange={handleFileChange} />
          {file && (
            <div className="file-preview">
              <p>File attached: <a href={file} target="_blank" rel="noopener noreferrer">View</a></p>
            </div>
          )}
        </div>
        
        <div className="popup-actions">
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={handleSubmit}>
            {step.completed ? 'Update' : 'Mark as Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepPopup;