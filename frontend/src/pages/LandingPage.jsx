import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1f2937 0%, #312e81 100%)',
      margin: 0,
      padding: '16px',
      boxSizing: 'border-box',
      color: 'white',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        padding: '32px',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '16px',
          background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🍽️ Food Classifier
        </h1>
        
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          color: '#d1d5db',
          marginBottom: '24px'
        }}>
          Identify food items in seconds with our AI-powered food classification app.
          Simply take a photo or upload an image, and our app will tell you what food item it is!
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#818cf8',
              fontSize: '20px'
            }}>
              📸
            </div>
            <div>
              <h3 style={{ 
                margin: '0 0 4px 0', 
                fontSize: '18px',
                color: '#e0e7ff'
              }}>
                Instant Food Recognition
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: '#a5b4fc',
                lineHeight: '1.5'
              }}>
                Take a photo with your camera or upload an existing image to identify food items quickly and easily.
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#818cf8',
              fontSize: '20px'
            }}>
              ⚡
            </div>
            <div>
              <h3 style={{ 
                margin: '0 0 4px 0', 
                fontSize: '18px',
                color: '#e0e7ff'
              }}>
                Fast & Accurate
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: '#a5b4fc',
                lineHeight: '1.5'
              }}>
                Our AI model quickly analyzes your images and provides accurate food identification results.
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#818cf8',
              fontSize: '20px'
            }}>
              🔍
            </div>
            <div>
              <h3 style={{ 
                margin: '0 0 4px 0', 
                fontSize: '18px',
                color: '#e0e7ff'
              }}>
                Wide Range of Foods
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: '#a5b4fc',
                lineHeight: '1.5'
              }}>
                Our system can identify 20 types of foods from Indian cuisine.
              </p>
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              backgroundImage: 'linear-gradient(to right, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.1s',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              Get Started
            </button>
          </Link>
          
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#a5b4fc',
              border: '1px solid #6366f1',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}>
              Log In
            </button>
          </Link>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '16px',
            color: '#e0e7ff' 
          }}>
            How It Works
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#a5b4fc',
            lineHeight: '1.5' 
          }}>
            Simply snap a photo or upload an image of a food item, and our AI algorithm will
            analyze it to determine what food item it is. No complicated setup required!
          </p>
        </div>
      </div>
      
      <footer style={{
        marginTop: '32px',
        fontSize: '14px',
        color: '#9ca3af'
      }}>
        © 2025 Food Classifier | All Rights Reserved
      </footer>
    </div>
  );
};

export default LandingPage;