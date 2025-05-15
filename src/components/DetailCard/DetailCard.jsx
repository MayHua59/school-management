
import React from 'react';
import { Link } from 'react-router-dom';

const DetailCard = ({ title, item, editUrl, onDelete, backUrl = '/' }) => {
  if (!item) {
    return (
      <div className="container mt-4">
        <h2>{title} Not Found</h2>
        <p>{title} not found.</p>
        <Link to={backUrl} className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>{title} Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          {/* {Object.entries(item).map(([key, value]) => (
            <p key={key} className="card-text">
              <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:</strong> {value}
            </p>
          ))} */}
          {Object.entries(item).filter(([key]) => key !== 'id').map(([key, value]) => (
 <p key={key} className="card-text">
 <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:</strong> {value}
 </p>
 ))}
          <Link to={backUrl} className="btn btn-warning mr-2">
            Back to List
          </Link>
          {editUrl && (
            <Link to={editUrl} className="btn btn-primary mr-2">
              Edit
            </Link>
          )}
          {onDelete && (
            <button className="btn btn-danger" onClick={() => onDelete(item)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailCard;