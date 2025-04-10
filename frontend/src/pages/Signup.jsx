import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('https://food-classifier-ihbm.onrender.com/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // You can store token if backend returns one (currently your backend just returns a message)
      // localStorage.setItem('authToken', response.data.token);

      navigate('/app'); // Redirect after successful signup
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1f2937 0%, #312e81 100%)',
      margin: 0,
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '300px',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginTop: '0',
          marginBottom: '20px',
          background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>🍽️ Create Account</h1>

        {error && (
          <div style={{
            padding: '8px',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            color: '#fca5a5',
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              color: '#d1d5db'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                backgroundColor: 'rgba(17, 24, 39, 0.7)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter username"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              color: '#d1d5db'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                backgroundColor: 'rgba(17, 24, 39, 0.7)',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#d1d5db' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#93c5fd', textDecoration: 'none' }}>
            Log In
          </Link>
        </div>

        <div style={{ marginTop: '16px' }}>
          <Link to="/" style={{
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
