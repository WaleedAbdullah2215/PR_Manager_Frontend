import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WelcomePage.css';

// Production configuration - works without environment variables
const CONFIG = {
  DEFAULT_USER: 'Mohammad Amir Khan',
  LOGIN_USERNAME: 'mohammadamir',
  LOGIN_PASSWORD: 'waleed123',
  DEMO_USER: 'waleed123'
};

// Helper function to get configuration value
const getConfig = (key) => {
  // Try environment variable first, then fallback to config
  const envKey = `REACT_APP_${key}`;
  return process.env[envKey] || CONFIG[key];
};

const WelcomePage = ({ onEnter }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const expectedUsername = getConfig('LOGIN_USERNAME');
      const expectedPassword = getConfig('LOGIN_PASSWORD');
      
      console.log('Expected:', expectedUsername, expectedPassword); // Debug log
      console.log('Entered:', username, password); // Debug log
      
      if (username === expectedUsername && password === expectedPassword) {
        onEnter('user');
      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleVisitorMode = () => {
    setIsLoading(true);
    setTimeout(() => {
      onEnter('visitor');
    }, 600);
  };

  return (
    <div className="welcome-page">
      {/* Background with overlay */}
      <div className="welcome-background">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" 
          alt="Office"
          className="bg-image"
        />
        <div className="bg-overlay"></div>
      </div>

      <div className="welcome-container">
        <AnimatePresence mode="wait">
          {!showLogin ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="welcome-box"
            >
              {/* Main Content */}
              <div className="welcome-header">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="brand-section"
                >
                  <div className="brand-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h1 className="brand-title">PR Flow Manager</h1>
                  <p className="brand-tagline">Streamlined Project Management System</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="brand-author"
                >
                  <p>Designed & Built for</p>
                  <h3>{getConfig('DEFAULT_USER')}</h3>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="action-section"
              >
                <button
                  onClick={() => setShowLogin(true)}
                  className="action-btn primary-btn"
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Sign In</span>
                </button>

                <button
                  onClick={handleVisitorMode}
                  className="action-btn secondary-btn"
                  disabled={isLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{isLoading ? 'Loading...' : 'View Demo'}</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="features-grid"
              >
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span>Task Management</span>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span>Progress Tracking</span>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span>Real-time Updates</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="login-box"
            >
              <button
                className="back-btn"
                onClick={() => {
                  setShowLogin(false);
                  setError('');
                  setUsername('');
                  setPassword('');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>

              <div className="login-header">
                <div className="login-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2>Welcome Back</h2>
                <p>Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    autoFocus
                    disabled={isLoading}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="error-box"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="login-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>


            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WelcomePage;