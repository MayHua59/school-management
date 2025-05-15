import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ShowError from "../../components/ShowError/ShowError"; 

// const SubjectFormValues = {
//     name: ''
//     
// };

const EditSubject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [fieldErrors, setFieldErrors] = useState({}); 
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axios.get(
          `https://cloudolt.software100.com.mm/api/v1/subjects/${id}`
        );
        setFormData(response.data);
        setOriginalData(response.data);
      } catch (error) { 
        setError(error.response?.data?.message || 'Failed to fetch Subject details');
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  const validateForm = (data) => { 
        const errors = {};
        if (!data.name.trim()) {
            errors.name = 'Name is required';
        } else if (data.name.length > 255) {
            errors.name = 'Name must be less than 256 characters';
        }

        

      

  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError(null); 
    const validationErrors = validateForm(formData);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
            return; // Stop submission
        }

    try {
      console.log(formData);
      const dataToSend = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          dataToSend[key] = formData[key];
        }
      });

      const response = await axios.put(
        `https://cloudolt.software100.com.mm/api/v1/subjects/${id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Subject updated successfully:', response.data);
      navigate('/subjects');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update Subject');
    }
  };

  if (loading) {
    return <div>Loading Subject details...</div>;
  }

  if (error) {
    return <ShowError message={error} />; 
  }

  return (
    <div className="container">
      <h1>Edit Subject</h1>
      
      <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.name && (
                        <div className="invalid-feedback">{fieldErrors.name}</div>
                    )}
                </div>
                
                <button type="submit" className="btn btn-primary">
                    Update Subject
                </button>
            </form>
      <Link to="/subjects" className="btn btn-secondary mt-3">
        Cancel
      </Link>
    </div>
  );
};
}

export default EditSubject;
