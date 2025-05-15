import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateSubject = () => {
    const [formData, setFormData] = useState({
        name: ''
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
            const response = await axios.post('https://cloudolt.software100.com.mm/api/v1/subjects', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Subject created successfully:', response.data);
            navigate('/subjects');
        } catch (error) {
             if (error.response && error.response.data && error.response.data.errors) {
                
                setFieldErrors(error.response.data.errors);
                setError(null); 
            } else if (error.response) {
                
                setError(error.response.data.message || `Error creating Subject (Status: ${error.response.status})`);
            } else {
                // @ts-ignore
                setError('An unexpected error occurred during creation.');
            }
            console.error('Error creating Subject:', error); 
        }
    };

    return (
        <div className="container">
            <h1>Create New Subject</h1>
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
                
               
                
                <button type="submit" className="btn btn-primary mt-3">Create New Subject</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                <Link to="/subjects" className="btn btn-secondary mt-3">Cancel</Link>
            </form>
        </div>
    );
};

export default CreateSubject;
