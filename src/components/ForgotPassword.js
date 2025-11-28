import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email, otp, newPassword
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with your backend to send OTP
    setMessage('OTP has been sent to your email');
    setStep('otp');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Here you would verify OTP with backend
    setMessage('OTP verified successfully');
    setStep('newPassword');
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    // Here you would update password in backend
    setMessage('Password reset successful');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="card-header">
          <i className="fas fa-lock"></i>
          <h2>Reset Password</h2>
        </div>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Send OTP
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label>
                <i className="fas fa-key"></i>
                Enter OTP
              </label>
              <div className="otp-input">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength="6"
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">
              Verify OTP
            </button>
          </form>
        )}

        {step === 'newPassword' && (
          <form onSubmit={handlePasswordReset}>
            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Reset Password
            </button>
          </form>
        )}

        {message && <div className="message">{message}</div>}

        <div className="links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
