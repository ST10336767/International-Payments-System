import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { validateEmail, sanitizeText } from '../../utils/validation';
import { formatApiError, getMainErrorMessage } from '../../utils/errorHandler';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize email input
    const sanitizedValue = name === 'email' ? sanitizeText(value) : value;
    
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
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    if (!formData.password || formData.password.length === 0) {
      errors.password = 'Password is required';
    }

    // If there are validation errors, display them
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      setTimeout(() => {
        setError('');
        setFieldErrors({});
      }, 15000);
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.role === 'Employee') {
          navigate('/employee');
        } else {
          navigate('/dashboard');
        }
      } catch (_) {
        navigate('/dashboard');
      }
    } else {
      const errorMessage = result.error || 'Login failed';
      setError(errorMessage);
      // Auto-clear error after 15 seconds
      setTimeout(() => {
        setError('');
        setFieldErrors({});
      }, 15000);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Login</h2>
          <p>Welcome back! Please sign in to your account.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{ borderColor: fieldErrors.password ? '#e53e3e' : undefined }}
            />
            {fieldErrors.password && (
              <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <Link to="/register" className="auth-link"> Sign up here</Link>
          </p>
          <p style={{ marginTop: '10px' }}>
            <Link to="/forgot-password" className="auth-link">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
