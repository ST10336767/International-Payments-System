import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get token and email from URL params (if using token method)
  const tokenFromUrl = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  const [formData, setFormData] = useState({
    email: emailFromUrl || '',
    token: tokenFromUrl || '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    resetMethod: tokenFromUrl ? 'token' : 'otp'
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setFormData(prev => ({
        ...prev,
        resetMethod: 'token',
        token: tokenFromUrl,
        email: emailFromUrl || ''
      }));
    }
  }, [tokenFromUrl, emailFromUrl]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setFieldErrors({});
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Za-z]/.test(password)) {
      return 'Password must contain at least one letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setFieldErrors({ newPassword: passwordError });
      return;
    }

    // Validate token or OTP is provided
    if (formData.resetMethod === 'token' && !formData.token) {
      setFieldErrors({ token: 'Reset token is required' });
      return;
    }
    if (formData.resetMethod === 'otp' && !formData.otp) {
      setFieldErrors({ otp: 'OTP is required' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        newPassword: formData.newPassword
      };

      if (formData.resetMethod === 'token') {
        payload.token = formData.token;
      } else {
        payload.otp = formData.otp;
      }

      const response = await api.post('/auth/reset-password', payload);

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error?.message || 
                          'Failed to reset password. Please try again.';
      setError(errorMessage);
      
      // Handle field-specific errors
      if (err.response?.data?.errors) {
        const fieldErrorsObj = {};
        err.response.data.errors.forEach(error => {
          if (error.path) {
            fieldErrorsObj[error.path] = error.msg;
          }
        });
        setFieldErrors(fieldErrorsObj);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success ? (
          <div className="success-message">
            <h3>Password Reset Successful!</h3>
            <p>Your password has been reset successfully. Redirecting to login...</p>
          </div>
        ) : (
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
                disabled={!!emailFromUrl}
              />
            </div>

            {formData.resetMethod === 'token' ? (
              <div className="form-group">
                <label htmlFor="token">Reset Token</label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  required
                  placeholder="Enter reset token"
                  disabled={!!tokenFromUrl}
                />
                {fieldErrors.token && (
                  <span className="field-error">{fieldErrors.token}</span>
                )}
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="otp">One-Time Password (OTP)</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  pattern="\d{6}"
                />
                {fieldErrors.otp && (
                  <span className="field-error">{fieldErrors.otp}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                minLength="8"
                pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
                title="Password must be at least 8 characters and contain both letters and numbers"
              />
              {fieldErrors.newPassword && (
                <span className="field-error">{fieldErrors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                minLength="8"
              />
              {fieldErrors.confirmPassword && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            <Link to="/login" className="auth-link">Back to Login</Link>
            {' | '}
            <Link to="/forgot-password" className="auth-link">Request New Reset</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

