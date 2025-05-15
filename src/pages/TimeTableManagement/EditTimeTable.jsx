import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ShowError from "../../components/ShowError/ShowError"; 

const EditTimeTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    day: '',
    period: '',
    subjects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [fieldErrors, setFieldErrors] = useState({}); 
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const response = await axios.get(
          `https://cloudolt.software100.com.mm/api/v1/timetables/${id}`
        );
        setFormData(response.data);
        setOriginalData(response.data);
      } catch (error) { 
        setError(error.response?.data?.message || 'Failed to fetch TimeTable details');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeTable();
  }, [id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubjectsChange = (subject, checked) => {
    let updatedSubjects = [...formData.subjects];
    if (checked) {
      if (!updatedSubjects.includes(subject)) {
        updatedSubjects.push(subject);
      }
    } else {
      updatedSubjects = updatedSubjects.filter(s => s !== subject);
    }
    setFormData({ ...formData, subjects: updatedSubjects });
    setFieldErrors(prev => ({ ...prev, subjects: '' }));
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
      const dataToSend = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          dataToSend[key] = formData[key];
        }
      });

      const response = await axios.put(
        `https://cloudolt.software100.com.mm/api/v1/timetables/${id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      navigate('/timetables');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update TimeTable');
    }
  };

  if (loading) {
    return <div>Loading TimeTable details...</div>;
  }

  if (error) {
    return <ShowError message={error} />; 
  }

  return (
    <div className="container">
      <h1>Edit TimeTable</h1>
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
        <button type="submit" className="btn btn-primary">Update TimeTable</button>
      </form>
      <Link to="/timetables" className="btn btn-secondary mt-3">Cancel</Link>
    </div>
  );
};

export default EditTimeTable;