import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateAccountNumber, 
  validateIdNumber,
  sanitizeText,
  sanitizeDigits
} from '../../utils/validation';
import { formatApiError, getMainErrorMessage, getAllFieldErrors } from '../../utils/errorHandler';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    accountNumber: '',
    idNumber: '',
    role: 'Customer'
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input based on field type
    let sanitizedValue = value;
    if (name === 'accountNumber' || name === 'idNumber') {
      sanitizedValue = sanitizeDigits(value);
    } else if (name === 'firstName' || name === 'lastName') {
      sanitizedValue = sanitizeText(value);
    } else if (name === 'email') {
      sanitizedValue = sanitizeText(value);
    }
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    
    const firstNameError = validateName(formData.firstName);
    if (firstNameError) errors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName);
    if (lastNameError) errors.lastName = lastNameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const accountNumberError = validateAccountNumber(formData.accountNumber);
    if (accountNumberError) errors.accountNumber = accountNumberError;
    
    const idNumberError = validateIdNumber(formData.idNumber);
    if (idNumberError) errors.idNumber = idNumberError;

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // If there are validation errors, display them
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      setTimeout(() => {
        setError('');
        setFieldErrors({});
      }, 10000);
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Handle different error formats
      let errorMessage = result.error;
      if (typeof result.error === 'object' && result.error.errors) {
        // Format validation errors
        errorMessage = result.error.errors.map(err => err.msg || err.message).join(', ');
      } else if (typeof result.error === 'string') {
        errorMessage = result.error;
      } else if (result.error?.message) {
        errorMessage = result.error.message;
      }
      setError(errorMessage || 'Registration failed. Please check your input and try again.');
      // Auto-clear error after 10 seconds
      setTimeout(() => {
        setError('');
        setFieldErrors({});
      }, 10000);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us today! Fill in your details to get started.</p>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            {Object.keys(fieldErrors).length > 0 && (
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                {Object.entries(fieldErrors).map(([field, msg]) => (
                  <li key={field}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                pattern="^[A-Za-z\s'-]{2,50}$"
                maxLength="50"
                title="First name must be 2-50 characters, letters, spaces, hyphens, and apostrophes only"
                style={{ borderColor: fieldErrors.firstName ? '#e53e3e' : undefined }}
              />
              {fieldErrors.firstName && (
                <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {fieldErrors.firstName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                pattern="^[A-Za-z\s'-]{2,50}$"
                maxLength="50"
                title="Last name must be 2-50 characters, letters, spaces, hyphens, and apostrophes only"
                style={{ borderColor: fieldErrors.lastName ? '#e53e3e' : undefined }}
              />
              {fieldErrors.lastName && (
                <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {fieldErrors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{ borderColor: fieldErrors.email ? '#e53e3e' : undefined }}
            />
            {fieldErrors.email && (
              <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                placeholder="10-12 digits"
                pattern="^\d{10,12}$"
                maxLength="12"
                title="Account number must be 10-12 digits"
                style={{ borderColor: fieldErrors.accountNumber ? '#e53e3e' : undefined }}
              />
              {fieldErrors.accountNumber && (
                <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {fieldErrors.accountNumber}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="idNumber">ID Number</label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                placeholder="13 digits"
                pattern="^\d{13}$"
                maxLength="13"
                title="ID number must be exactly 13 digits"
                style={{ borderColor: fieldErrors.idNumber ? '#e53e3e' : undefined }}
              />
              {fieldErrors.idNumber && (
                <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {fieldErrors.idNumber}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password (min 8 chars, letters & numbers)"
                minLength="8"
                style={{ borderColor: fieldErrors.password ? '#e53e3e' : undefined }}
              />
              {fieldErrors.password && (
                <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                minLength="8"
                style={{ borderColor: fieldErrors.confirmPassword ? '#e53e3e' : undefined }}
              />
              {fieldErrors.confirmPassword && (
                <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>
          </div>


          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/login" className="auth-link"> Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
