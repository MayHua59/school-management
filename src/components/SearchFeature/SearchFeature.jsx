import React from 'react';


const SearchFeature = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <button className="btn btn-outline-secondary" type="button">
        <i className="bi bi-search">Search</i>
      </button>
    </div>
  );
};

export default SearchFeature;
