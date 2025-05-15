import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ShowError from "../../components/ShowError/ShowError"; 



const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      role: "",
      password: "",
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [fieldErrors, setFieldErrors] = useState({}); 
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://cloudolt.software100.com.mm/api/v1/users/${id}`
        );
        setFormData(response.data);
        setOriginalData(response.data);
      } catch (error) { 
        setError(error.response?.data?.message || 'Failed to fetch User details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const validateForm = (data) => { 
        const errors = {};
        if (!data.name.trim()) {
            errors.name = 'Name is required';
        } else if (data.name.length > 255) {
            errors.name = 'Name must be less than 256 characters';
        }

        if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)
    ) {
      errors.email = "Invalid email address format";
    }

        
         if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

        return errors;
    };

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
        `https://cloudolt.software100.com.mm/api/v1/users/${id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('User updated successfully:', response.data);
      navigate('/users');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update User');
    }
  };

  if (loading) {
    return <div>Loading User details...</div>;
  }

  if (error) {
    return <ShowError message={error} />; 
  }

  return (
    <div className="container">
      <h1>Edit OLT</h1>
      
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
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="text"
                        className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.email && (
                        <div className="invalid-feedback">{fieldErrors.email}</div>
                    )}
                </div>
                 <div className="mb-3">
          <label htmlFor="role" className="form-label">
            User's Role
          </label>
          <select
            className={`form-control ${fieldErrors.role ? "is-invalid" : ""}`}
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {fieldErrors.role && (
            <div className="invalid-feedback">{fieldErrors.role}</div>
          )}
        </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.password && (
                       <div className="invalid-feedback">{fieldErrors.password}</div>
                    )}
                </div>
              
               
                <button type="submit" className="btn btn-primary">
                    Update User
                </button>
            </form>
      <Link to="/users" className="btn btn-secondary mt-3">
        Cancel
      </Link>
    </div>
  );
};

export default EditUser;
