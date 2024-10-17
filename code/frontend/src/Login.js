import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateName = (name) => {
    return name.length >= 3 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = loginData.email.trim();
    const trimmedPassword = loginData.password.trim();
  
    if (!validateEmail(trimmedEmail) || !validatePassword(trimmedPassword)) {
      setErrorMessage('Invalid email or password.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/api/signin', {
        email: trimmedEmail,
        password: trimmedPassword,
      });
  
      setSuccessMessage(`Login successful. Welcome ${response.data.user.name}!`);
      setErrorMessage('');
      onLoginSuccess(response.data.user.name);
      setLoginData({ email: '', password: '' }); // Clear login fields
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error);
      setErrorMessage('Login failed. Please check your credentials.');
      setSuccessMessage('');
    }
  };
  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateName(signupData.name)) {
      setErrorMessage('Name must be at least 3 characters long and contain no numbers.');
      return;
    }

    if (!validateEmail(signupData.email)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    if (!validatePassword(signupData.password)) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      await axios.post('http://localhost:4000/api/signup', signupData);
      setSuccessMessage('Signup successful! You can now log in.');
      setErrorMessage('');
      setSignupData({ name: '', email: '', password: '' }); // Clear signup fields
    } catch (error) {
      setErrorMessage('Signup failed. Please try again.');
      setSuccessMessage('');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="row">
        {/* Sign In Form (Left Side) */}
        <div className="col-md-6">
          <div className="card shadow p-4 mb-5 bg-white rounded">
            <h2 className="text-center">Sign In</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="my-2">Email</label>
                <input
                  type="email"
                  className="form-control my-2"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="my-2">Password</label>
                <input
                  type="password"
                  className="form-control my-2"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-custom">
                Sign In
              </button>
            </form>
          </div>
        </div>

        {/* Sign Up Form (Right Side) */}
        <div className="col-md-6">
          <div className="card shadow p-4 mb-5 bg-white rounded">
            <h2 className="text-center">Sign Up</h2>
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label className="my-2">Name</label>
                <input
                  type="text"
                  className="form-control my-2"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="my-2">Email</label>
                <input
                  type="email"
                  className="form-control my-2"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="my-2">Password</label>
                <input
                  type="password"
                  className="form-control my-2"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success btn-block btn-custom">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
