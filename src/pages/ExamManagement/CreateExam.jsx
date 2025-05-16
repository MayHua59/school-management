import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateExam = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        date: '',
        subjects: "",
        
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null); 
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFieldErrors(prev => ({ ...prev, [name]: '' })); 
    };

   const validateForm = (data) => {
    const errors = {};

    if (!data.name.trim()) {
            errors.name = 'Name is required';
        } else if (data.name.length > 255) {
            errors.name = 'Name must be less than 256 characters';
        }

    if (!data.date) {
        errors.date = 'Date is required';
    } 

    // if (!data.subjects || data.subjects.length === 0) {
    //   errors.subjects = 'At least one subject is required';
    // } else if (!Array.isArray(data.subjects)) {
    //   errors.subjects = 'Subjects must be an array';
    // } else {
    //   for (let i = 0; i < data.subjects.length; i++) {
    //     if (typeof data.subjects[i] !== 'string' || !data.subjects[i].trim()) {
    //       errors.subjects = 'Subject names cannot be empty';
    //       break;
    //     }
    //   }
    // }
    return errors;
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        const validationErrors = validateForm(formData);
        setFieldErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return; 
        }

        try {
            const response = await axios.post('https://cloudolt.software100.com.mm/api/v1/exams', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Exam created successfully:', response.data);
            navigate('/exams');
        } catch (error) {
             if (error.response && error.response.data && error.response.data.errors) {
                
                setFieldErrors(error.response.data.errors);
                setError(null); 
            } else if (error.response) {
                
                setError(error.response.data.message || `Error creating Exam (Status: ${error.response.status})`);
            } else {
                // @ts-ignore
                setError('An unexpected error occurred during creation.');
            }
            console.error('Error creating Exam:', error); 
        }
    };

    return (
        <div className="container">
            <h1>Create New Exam</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
          <label htmlFor="day" className="form-label">Name</label>
          <select
            className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          >
            <option value="">Select Exam Category</option>
            <option value="mid-term">Mid-Term</option>
            <option value="final">Final</option>
            
          </select>
          {fieldErrors.name && (
            <div className="invalid-feedback">{fieldErrors.name}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="period" className="form-label">Period</label>
          <input
            type="datetime-local"
            className={`form-control ${fieldErrors.date ? 'is-invalid' : ''}`}
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min="1"
            max="100"
            required
          />
          {fieldErrors.date && (
            <div className="invalid-feedback">{fieldErrors.date}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Subjects</label>
          <div className={`form-group ${fieldErrors.subjects ? 'is-invalid' : ''}`}>
            {['Myanmar', 'English', 'Maths'].map((subject) => (
              <div key={subject} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`subject-${subject}`}
                  name="subjects"
                  value={subject}
                  checked={formData.subjects.includes(subject)}
                  onChange={(e) => handleSubjectsChange(subject, e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`subject-${subject}`}>
                  {subject}
                </label>
              </div>
            ))}
          </div>
          {fieldErrors.subjects && (
            <div className="invalid-feedback">{fieldErrors.subjects}</div>
          )}
        </div>
                <button type="submit" className="btn btn-primary mt-3">Create New Exam</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                <Link to="/exams" className="btn btn-secondary mt-3">Cancel</Link>
            </form>
        </div>
    );
};

export default CreateExam;
