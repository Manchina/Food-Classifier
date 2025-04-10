import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:8000/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory(res.data.history);
        setUsername(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load history. Please try again later.");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1f2937 0%, #312e81 100%)',
      margin: 0,
      padding: '16px',
      boxSizing: 'border-box',
      color: 'white',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        padding: '32px',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
          background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}>
          🍽️ Your Prediction History
        </h1>
        
        <h2 style={{
          fontSize: '24px',
          color: '#d1d5db',
          fontWeight: 'normal',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          Welcome, {username}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#a5b4fc', fontSize: '18px' }}>Loading your history...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#ef4444', fontSize: '18px' }}>{error}</p>
          </div>
        ) : (
          <>
            {history.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
                width: '100%',
              }}>
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '180px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <img 
                        src={item.image_url} 
                        alt={item.prediction}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                      />
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h3 style={{ 
                        margin: '0 0 12px 0',
                        fontSize: '20px',
                        color: '#e0e7ff',
                      }}>
                        {item.prediction}
                      </h3>
                      
                      <div style={{ 
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{ 
                          backgroundColor: 'rgba(79, 70, 229, 0.2)',
                          borderRadius: '12px',
                          padding: '4px 8px',
                          fontSize: '14px',
                          color: '#a5b4fc',
                        }}>
                          {(item.confidence * 100).toFixed(2)}% Confidence
                        </span>
                      </div>
                      
                      <p style={{ 
                        margin: '8px 0 0 0',
                        fontSize: '14px',
                        color: '#9ca3af',
                      }}>
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}>
                <p style={{ color: '#a5b4fc', fontSize: '18px', margin: 0 }}>
                  No prediction history found. Start by classifying some food images!
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      <footer style={{
        marginTop: 'auto',
        padding: '16px 0',
        fontSize: '14px',
        color: '#9ca3af',
        textAlign: 'center',
        width: '100%',
      }}>
        © 2025 Food Classifier | All Rights Reserved
      </footer>
    </div>
  );
}