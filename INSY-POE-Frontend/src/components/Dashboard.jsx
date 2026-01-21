// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import './Dashboard.css';

// const Dashboard = () => {
//   const { user, logout, isEmployee, isCustomer } = useAuth();
//   const navigate = useNavigate();
//   const [securityInfo, setSecurityInfo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSecurityInfo = async () => {
//       try {
//         const response = await api.get('/security-test');
//         setSecurityInfo(response.data);
//       } catch (error) {
//         console.error('Failed to fetch security info:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSecurityInfo();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-container">
//         <div className="loading">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <nav className="nav">
//           <div className="nav-brand">
//             <h2>INSY POE</h2>
//           </div>
//           <div className="nav-links">
//             <span className="welcome-text">Welcome, {user?.firstName} {user?.lastName}</span>
//             <span className="user-role">{user?.role}</span>
//             <button onClick={handleLogout} className="logout-btn">
//               Logout
//             </button>
//           </div>
//         </nav>
//       </header>

//       <main className="dashboard-main">
//         <div className="dashboard-grid">
//           {/* User Info Card */}
//           <div className="dashboard-card">
//             <h3>Account Information</h3>
//             <div className="info-grid">
//               <div className="info-item">
//                 <label>Email:</label>
//                 <span>{user?.email}</span>
//               </div>
//               <div className="info-item">
//                 <label>Name:</label>
//                 <span>{user?.firstName} {user?.lastName}</span>
//               </div>
//               <div className="info-item">
//                 <label>Role:</label>
//                 <span className="role-badge">{user?.role}</span>
//               </div>
//               <div className="info-item">
//                 <label>Account Number:</label>
//                 <span>{user?.accountNumber}</span>
//               </div>
//               <div className="info-item">
//                 <label>ID Number:</label>
//                 <span>{user?.idNumber}</span>
//               </div>
//             </div>
//           </div>

//           {/* Security Info Card */}
//           {securityInfo && (
//             <div className="dashboard-card">
//               <h3>Security Status</h3>
//               <div className="security-info">
//                 <div className="security-item">
//                   <label>Environment:</label>
//                   <span className="env-badge">{securityInfo.environment}</span>
//                 </div>
//                 <div className="security-item">
//                   <label>CSP Mode:</label>
//                   <span className="csp-badge">{securityInfo.cspMode}</span>
//                 </div>
//                 <div className="security-item">
//                   <label>Last Updated:</label>
//                   <span>{new Date(securityInfo.timestamp).toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Role-based Content */}
//           {isCustomer() && (
//             <div className="dashboard-card customer-card">
//               <h3>Customer Portal</h3>
//               <p>Welcome to your customer dashboard. Here you can:</p>
//               <ul>
//                 <li>View your account information</li>
//                 <li>Access secure features</li>
//                 <li>Manage your profile</li>
//               </ul>
//             </div>
//           )}

//           {isEmployee() && (
//             <div className="dashboard-card employee-card">
//               <h3>Employee Portal</h3>
//               <p>Welcome to the employee dashboard. You have access to:</p>
//               <ul>
//                 <li>Advanced system features</li>
//                 <li>User management tools</li>
//                 <li>Administrative functions</li>
//               </ul>
//             </div>
//           )}

//           {/* Quick Actions */}
//           <div className="dashboard-card">
//             <h3>Quick Actions</h3>
//             <div className="action-buttons">
//               <button className="action-btn primary">
//                 Update Profile
//               </button>
//               <button className="action-btn secondary">
//                 Security Settings
//               </button>
//               <button className="action-btn secondary">
//                 Help & Support
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { validateAccountNumber, validateAmount, validateSwiftCode, sanitizeDigits, sanitizeSwiftCode } from '../utils/validation';
import { formatApiError, getMainErrorMessage, getAllFieldErrors } from '../utils/errorHandler';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    recipientAccount: '',
    amount: '',
    currency: 'USD',
    provider: 'SWIFT',
    swiftCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch user payment history
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/customers/payments');
        setPayments(res.data || []);
      } catch (err) {
        console.error('Failed to fetch payments', err);
      }
    };
    fetchPayments();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input based on field type
    let sanitizedValue = value;
    if (name === 'recipientAccount') {
      sanitizedValue = sanitizeDigits(value);
    } else if (name === 'swiftCode') {
      sanitizedValue = sanitizeSwiftCode(value);
    } else if (name === 'amount') {
      sanitizedValue = sanitizeDigits(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setFieldErrors({});
    
    // Client-side validation
    const errors = {};
    
    const recipientAccountError = validateAccountNumber(formData.recipientAccount);
    if (recipientAccountError) errors.recipientAccount = recipientAccountError;
    
    const amountError = validateAmount(formData.amount);
    if (amountError) errors.amount = amountError;
    
    if (formData.provider === 'SWIFT') {
      const swiftCodeError = validateSwiftCode(formData.swiftCode);
      if (swiftCodeError) errors.swiftCode = swiftCodeError;
    }

    // If there are validation errors, display them
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/customers/payments', formData);
      setMessage({ type: 'success', text: 'Payment created successfully!' });
      setPayments(prev => [res.data.transaction, ...prev]);
      setFormData({
        recipientAccount: '',
        amount: '',
        currency: 'USD',
        provider: 'SWIFT',
        swiftCode: ''
      });
    } catch (err) {
      console.error(err);
      const formattedError = formatApiError(err);
      const errorMessage = getMainErrorMessage(formattedError);
      setMessage({ type: 'error', text: errorMessage });
      
      // Handle structured field errors from backend
      if (formattedError && typeof formattedError === 'object') {
        const fieldErrs = getAllFieldErrors(formattedError);
        setFieldErrors(fieldErrs);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="nav">
          <div className="nav-brand">
            <h2>INSY POE - Payment Portal</h2>
          </div>
          <div className="nav-links">
            <span className="welcome-text">Welcome, {user?.firstName}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">

          {/* User Info */}
          <div className="dashboard-card">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Account Number:</label>
                <span>{user?.accountNumber}</span>
              </div>
              <div className="info-item">
                <label>ID Number:</label>
                <span>{user?.idNumber}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="dashboard-card">
            <h3>Make a Payment</h3>
            {message && (
              <div
                style={{
                  color: message.type === 'error' ? '#e53e3e' : '#48bb78',
                  marginBottom: '12px',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: message.type === 'error' ? '#fed7d7' : '#c6f6d5',
                }}
              >
                <strong>{message.type === 'error' ? 'Error:' : 'Success:'}</strong> {message.text}
                {Object.keys(fieldErrors).length > 0 && (
                  <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                    {Object.entries(fieldErrors).map(([field, msg]) => (
                      <li key={field}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="info-item">
                <label>Recipient Account:</label>
                <input
                  type="text"
                  name="recipientAccount"
                  value={formData.recipientAccount}
                  onChange={handleChange}
                  required
                  pattern="^\d{10,12}$"
                  maxLength="12"
                  title="Recipient account must be 10-12 digits"
                  style={{ borderColor: fieldErrors.recipientAccount ? '#e53e3e' : undefined }}
                />
                {fieldErrors.recipientAccount && (
                  <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    {fieldErrors.recipientAccount}
                  </span>
                )}
              </div>
              <div className="info-item">
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  required
                  title="Amount must be greater than 0.01"
                  style={{ borderColor: fieldErrors.amount ? '#e53e3e' : undefined }}
                />
                {fieldErrors.amount && (
                  <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    {fieldErrors.amount}
                  </span>
                )}
              </div>
              <div className="info-item">
                <label>Currency:</label>
                <select name="currency" value={formData.currency} onChange={handleChange}>
                  <option value="USD">USD</option>
                  <option value="ZAR">ZAR</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
              <div className="info-item">
                <label>Provider:</label>
                <select name="provider" value={formData.provider} onChange={handleChange}>
                  <option value="SWIFT">SWIFT</option>
                </select>
              </div>
              <div className="info-item">
                <label>SWIFT Code:</label>
                <input
                  type="text"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleChange}
                  required={formData.provider === 'SWIFT'}
                  pattern="^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$"
                  maxLength="11"
                  title="SWIFT code must be 8 or 11 characters (e.g., ABCDZAJJ or ABCDZAJJ123)"
                  style={{ borderColor: fieldErrors.swiftCode ? '#e53e3e' : undefined }}
                />
                {fieldErrors.swiftCode && (
                  <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    {fieldErrors.swiftCode}
                  </span>
                )}
              </div>
              <button type="submit" className="action-btn primary" disabled={loading}>
                {loading ? 'Processing...' : 'Send Payment'}
              </button>
            </form>
          </div>

          {/* Payment History */}
          <div className="dashboard-card">
            <h3>Recent Transactions</h3>
            {payments.length === 0 ? (
              <p>No transactions yet.</p>
            ) : (
              <div className="info-grid">
                {payments.map((txn) => (
                  <div className="info-item" key={txn._id}>
                    <div>
                      <strong>{txn.amount} {txn.currency}</strong> → {txn.recipientAccount}
                    </div>
                    <div>Status: {txn.status}</div>
                    <div>Date: {new Date(txn.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
