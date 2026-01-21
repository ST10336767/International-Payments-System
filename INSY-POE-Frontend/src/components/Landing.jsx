import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <nav className="nav">
          <div className="nav-brand">
            <h2>INSY POE</h2>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link primary">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="hero-content">
            <h1>Secure Banking Portal</h1>
            <p>
              Experience the next generation of secure banking with our 
              enterprise-grade security features and user-friendly interface.
            </p>
            <div className="hero-buttons">
              {isAuthenticated() ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-content">
            <h2>Why Choose Our Platform?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Enterprise Security</h3>
                <p>
                  Advanced security headers, CSP protection, and 
                  role-based access control keep your data safe.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Fast & Reliable</h3>
                <p>
                  Built with modern technologies for optimal 
                  performance and user experience.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Role-Based Access</h3>
                <p>
                  Different access levels for customers and employees 
                  with secure authentication.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="security-info">
          <div className="security-content">
            <h2>Security Features</h2>
            <div className="security-grid">
              <div className="security-item">
                <h4>Content Security Policy (CSP)</h4>
                <p>Prevents XSS attacks and unauthorized script execution</p>
              </div>
              <div className="security-item">
                <h4>HTTPS Enforcement</h4>
                <p>All connections are secured with HSTS headers</p>
              </div>
              <div className="security-item">
                <h4>Rate Limiting</h4>
                <p>Protection against brute force and DDoS attacks</p>
              </div>
              <div className="security-item">
                <h4>JWT Authentication</h4>
                <p>Secure token-based authentication system</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2025 INSY POE. Built with security in mind.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
