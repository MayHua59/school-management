import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (data.name.length > 255) {
      errors.name = "Name must be less than 256 characters";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)
    ) {
      errors.email = "Invalid email address format";
    }

    // if (!data.role.trim()) {
    //   errors.role = "Role is required";
    // } else if (data.role.length > 255) {
    //   errors.role = "Role must be less than 256 characters";
    // }
    
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
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
      const response = await axios.post(
        "https://cloudolt.software100.com.mm/api/v1/users",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("User created successfully:", response.data);
      navigate("/users");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setFieldErrors(error.response.data.errors);
        setError(null);
      } else if (error.response) {
        setError(
          error.response.data.message ||
            `Error creating User (Status: ${error.response.status})`
        );
      } else {
        // @ts-ignore
        setError("An unexpected error occurred during creation.");
      }
      console.error("Error creating User:", error);
    }
  };

  return (
    <div className="container">
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
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
          <label htmlFor="email" className="form-label">
            IP Address
          </label>
          <input
            type="email"
            className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
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
          <label htmlFor="password" className="form-label">
            Location
          </label>
          <input
            type="text"
            className={`form-control ${
              fieldErrors.password ? "is-invalid" : ""
            }`}
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
        
        <button type="submit" className="btn btn-primary mt-3">
          Create New User
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        <Link to="/users" className="btn btn-secondary mt-3">
          Cancel
        </Link>
      </form>
    </div>
  );
};

export default CreateUser;
