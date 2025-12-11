import React, { useState } from 'react';

const CreatePRModal = ({ onClose, onCreate }) => {
  const [prId, setPrId] = useState('');
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prId || !description) return;
    
    onCreate(prId, description, comment, file);
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="popup-overlay">
      <div className="create-pr-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Create New Purchase Request</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>PR ID *</label>
            <input 
              type="text" 
              value={prId} 
              onChange={(e) => setPrId(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Initial Comments</label>
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any initial comments about this PR..."
            />
          </div>
          
          <div className="form-group">
            <label>Attach File</label>
            <input type="file" onChange={handleFileChange} />
            {file && (
              <div className="file-preview">
                <p>File attached: <a href={file} target="_blank" rel="noopener noreferrer">View</a></p>
              </div>
            )}
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Create PR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePRModal;