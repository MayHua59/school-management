import React from 'react';


const ShowError = ({message}) => {
  if (!message) {
        return null; 
    }
  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <i className="bi bi-exclamation-triangle me-2"></i>
      <strong>Error:</strong> {message}
      {/* <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button> */}
    </div>
  )
}

export default ShowError