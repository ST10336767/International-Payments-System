import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    resetMethod: 'token' // 'token' or 'otp'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', {
        email: formData.email,
        resetMethod: formData.resetMethod
      });

      if (response.data.success) {
        setSuccess(true);
        // If token/OTP is in response (development mode), log it
        if (response.data.otp) {
          console.log('🔐 Password Reset OTP:', response.data.otp);
        }
        if (response.data.resetUrl) {
          console.log('🔐 Password Reset URL:', response.data.resetUrl);
        }
        if (response.data.token) {
          console.log('🔐 Password Reset Token:', response.data.token);
        }
      } else {
        setError(response.data.message || 'Failed to send reset request');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error?.message || 
                          'Failed to send password reset request. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success ? (
          <div className="success-message">
            <h3>Reset Request Sent!</h3>
            <p>
              {formData.resetMethod === 'otp' 
                ? 'A 6-digit OTP has been generated. Check the server console or browser console for the OTP.'
                : 'A password reset link has been generated. Check the server console or browser console for the link.'}
            </p>
            
            <div style={{ marginTop: '20px' }}>
              <Link to="/reset-password" className="auth-link">
                Go to Reset Password
              </Link>
            </div>
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="resetMethod">Reset Method</label>
              <select
                id="resetMethod"
                name="resetMethod"
                value={formData.resetMethod}
                onChange={handleChange}
                className="form-select"
              >
                <option value="token">Reset Link (Token)</option>
                <option value="otp">One-Time Password (OTP)</option>
              </select>
              <small className="form-hint">
                {formData.resetMethod === 'otp' 
                  ? 'You will receive a 6-digit code via email'
                  : 'You will receive a reset link via email'}
              </small>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Request'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Remember your password? 
            <Link to="/login" className="auth-link"> Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

