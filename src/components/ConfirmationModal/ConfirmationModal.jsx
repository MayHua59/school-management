import React, { useEffect } from 'react';
// import './ConfirmationModal.css'; 
const ConfirmationModal = ({ itemId, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this item?</p>
        <div className="confirmation-modal-buttons">
          <button
            onClick={() => onConfirm(true)}
            className="confirmation-modal-danger-button"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => onConfirm(false)}
            className="confirmation-modal-secondary-button"
          >
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;