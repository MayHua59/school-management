import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTimeTable = () => {
    const [formData, setFormData] = useState({
        id: '',
        day: '',
        period: '',
        subjects: [],
        
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

    if (!data.day) {
      errors.day = 'Day is required';
    } else if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(data.day)) {
      errors.day = 'Invalid day. Please select a valid day of the week.';
    }

    if (!data.period) {
      errors.period = 'Period is required';
    } else if (isNaN(Number(data.period)) || Number(data.period) <= 0 || Number(data.period) > 100) {
      errors.period = 'Period must be a positive number between 1 and 100.';
    }

    if (!data.subjects || data.subjects.length === 0) {
      errors.subjects = 'At least one subject is required';
    } else if (!Array.isArray(data.subjects)) {
      errors.subjects = 'Subjects must be an array';
    } else {
      for (let i = 0; i < data.subjects.length; i++) {
        if (typeof data.subjects[i] !== 'string' || !data.subjects[i].trim()) {
          errors.subjects = 'Subject names cannot be empty';
          break;
        }
      }
    }
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
            const response = await axios.post('https://cloudolt.software100.com.mm/api/v1/timetables', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('TimeTable created successfully:', response.data);
            navigate('/timetables');
        } catch (error) {
             if (error.response && error.response.data && error.response.data.errors) {
                
                setFieldErrors(error.response.data.errors);
                setError(null); 
            } else if (error.response) {
                
                setError(error.response.data.message || `Error creating TimeTable (Status: ${error.response.status})`);
            } else {
                // @ts-ignore
                setError('An unexpected error occurred during creation.');
            }
            console.error('Error creating TimeTable:', error); 
        }
    };

    return (
        <div className="container">
            <h1>Create New OLT</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
          <label htmlFor="day" className="form-label">Day</label>
          <select
            className={`form-control ${fieldErrors.day ? 'is-invalid' : ''}`}
            id="day"
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          {fieldErrors.day && (
            <div className="invalid-feedback">{fieldErrors.day}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="period" className="form-label">Period</label>
          <input
            type="number"
            className={`form-control ${fieldErrors.period ? 'is-invalid' : ''}`}
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            min="1"
            max="100"
            required
          />
          {fieldErrors.period && (
            <div className="invalid-feedback">{fieldErrors.period}</div>
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
                <button type="submit" className="btn btn-primary mt-3">Create New Time Table</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                <Link to="/admin/olts" className="btn btn-secondary mt-3">Cancel</Link>
            </form>
        </div>
    );
};

export default CreateTimeTable;
