import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './register.css';

const RegistrationForm = (props) => {
  const [formData, setFormData] = useState({
    username: props.usernameValue || '',
    fullName: props.fullNameValue || '',
    email: props.emailValue || '',
    phone: props.phoneValue || '',
    password: props.passwordValue || '',
    repassword: '',
  });

  const [readonly, setReadOnly] = useState(false);
  const [title, setTitle] = useState("User Registration");
  const [buttonTitle, setButtonTitle] = useState("Register");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      username: props.usernameValue,
      fullName: props.fullNameValue,
      email: props.emailValue,
      phone: props.phoneValue,
      password: props.passwordValue,
    }));

    if (props.action === "update") {
      setReadOnly(true);
      setTitle("Edit Profile");
      setButtonTitle("Update");
    }
  }, [props.usernameValue, props.fullNameValue, props.emailValue, props.phoneValue, props.passwordValue, props.action]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.username || formData.username.includes(' ')) {
      validationErrors.username = 'Username is required and cannot contain spaces';
    }
    if (!formData.fullName || formData.fullName.length < 3) {
      validationErrors.fullName = 'Full Name must have at least 3 characters';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      validationErrors.email = 'Invalid email address';
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      validationErrors.phone = 'Phone number must be 10 digits';
    }
    // For creation, password is required and must be validated
    if (props.action === "create") {
      if (!formData.password || formData.password.length < 6) {
        validationErrors.password = 'Password must be at least 6 characters long';
      }
      if (formData.password !== formData.repassword) {
        validationErrors.repassword = 'Passwords do not match';
      }
    }
    // For updates, password is optional, but if provided, it must be valid
    if (props.action === "update" && formData.password && formData.password.length < 6) {
      validationErrors.password = 'New password must be at least 6 characters long';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Pass validated data to parent onSubmit handler
    props.onSubmit(formData);
  };

  return (
    <div className="registration-container">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a unique username"
            required
            readOnly={readonly}
          />
          {errors.username && <span className="register-error">{errors.username}</span>}
        </div>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
          {errors.fullName && <span className="register-error">{errors.fullName}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            required
          />
          {errors.email && <span className="register-error">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="phone">Phone No:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            required
          />
          {errors.phone && <span className="register-error">{errors.phone}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={props.action === "create"}
            placeholder={props.action === "update" ? "Leave blank to keep current password" : "Minimum 6 characters"}
          />
          {errors.password && <span className="register-error">{errors.password}</span>}
        </div>
        {props.action === "create" && (
          <div>
            <label htmlFor="repassword">Confirm Password:</label>
            <input
              type="password"
              id="repassword"
              name="repassword"
              value={formData.repassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />
            {errors.repassword && <span className="register-error">{errors.repassword}</span>}
          </div>
        )}
        <button className='button' type="submit">{buttonTitle}</button>
      </form>
    </div>
  );
};

RegistrationForm.propTypes = {
  usernameValue: PropTypes.string,
  fullNameValue: PropTypes.string,
  emailValue: PropTypes.string,
  phoneValue: PropTypes.string,
  passwordValue: PropTypes.string,
  action: PropTypes.oneOf(['create', 'update']).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

RegistrationForm.defaultProps = {
  usernameValue: '',
  fullNameValue: '',
  emailValue: '',
  phoneValue: '',
  passwordValue: '',
};

export default RegistrationForm;
