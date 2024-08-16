// EditAxisTitlePopup.jsx
import React, { useState } from 'react';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';

const EditAxisTitlePopup = ({ oldXTitle, oldYTitle, onSave, onClose }) => {
  const [newXTitle, setNewXTitle] = useState('');
  const [newYTitle, setNewYTitle] = useState('');

  const handleSave = () => {
    onSave(newXTitle, newYTitle);
    onClose();
  };

  return (
    <div className="overlay">
      <div className="edit-popup">
        <div className="edit-popup-header">
          <button onClick={onClose}><FaArrowLeft /> Back</button>
          <button 
            onClick={handleSave} 
            disabled={!(newXTitle.trim() || newYTitle.trim())}
          >
            <FaCheck /> Save
          </button>
        </div>
        <table className="edit-table">
          <tbody>
            <tr>
              <td>Old X-axis title:</td>
              <td>{oldXTitle}</td>
            </tr>
            <tr>
              <td>New X-axis title:</td>
              <td>
                <input 
                  type="text" 
                  value={newXTitle} 
                  onChange={(e) => setNewXTitle(e.target.value)}
                  placeholder="Enter new X-axis title"
                />
              </td>
            </tr>
            <tr>
              <td>Old Y-axis title:</td>
              <td>{oldYTitle}</td>
            </tr>
            <tr>
              <td>New Y-axis title:</td>
              <td>
                <input 
                  type="text" 
                  value={newYTitle} 
                  onChange={(e) => setNewYTitle(e.target.value)}
                  placeholder="Enter new Y-axis title"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditAxisTitlePopup;