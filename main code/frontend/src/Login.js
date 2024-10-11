import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = loginData.email.trim();
    const trimmedPassword = loginData.password.trim();
  
    try {
      const response = await axios.post('http://localhost:4000/api/signin', {
        email: trimmedEmail,
        password: trimmedPassword,
      });
  
      // Handle successful login
      setSuccessMessage(`Login successful. Welcome ${response.data.user.name}!`);
      setErrorMessage(''); // Clear any previous error message
      onLoginSuccess(response.data.user.name); // Update user name in App.js
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error);
      setErrorMessage('Login failed. Please check your credentials.');
      setSuccessMessage(''); // Clear any previous success message
    }
  };
  

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/signup', signupData);
      setSuccessMessage('Signup successful!');
      setErrorMessage('');
      // Clear the signup form
      setSignupData({ name: '', email: '', password: '' });
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
          <h2 className="text-center">Sign In</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className='my-2'>Email</label>
              <input
                type="email"
                className="form-control my-2"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className='my-2'>Password</label>
              <input
                type="password"
                className="form-control my-2"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Sign In
            </button>
          </form>
        </div>

        {/* Sign Up Form (Right Side) */}
        <div className="col-md-6">
          <h2 className="text-center">Sign Up</h2>
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className='my-2'>Name</label>
              <input
                type="text"
                className="form-control my-2"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className='my-2'>Email</label>
              <input
                type="email"
                className="form-control my-2"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className='my-2'>Password</label>
              <input
                type="password"
                className="form-control my-2"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success btn-block">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
