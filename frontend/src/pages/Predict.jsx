import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar';
import '../App.css';

const Predict = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // Store the camera stream reference
  const [prediction, setPrediction] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const setupCamera = async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      try {
        // First try to access the rear camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" }
          }
        });
        
        // Store the stream reference
        streamRef.current = stream;
        
        // Connect to video element if it exists
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Make sure video starts playing
          await videoRef.current.play();
          setMessage(''); // Clear any previous messages
        }
      } catch (err) {
        // If rear camera fails, try the front camera
        console.log("Rear camera not available, trying front camera:", err);
        
        try {
          const frontStream = await navigator.mediaDevices.getUserMedia({
            video: true // Request any available camera
          });
          
          // Store the stream reference
          streamRef.current = frontStream;
          
          // Connect to video element if it exists
          if (videoRef.current) {
            videoRef.current.srcObject = frontStream;
            
            // Make sure video starts playing
            await videoRef.current.play();
            setMessage(''); // Clear any previous messages
          }
        } catch (frontErr) {
          // If front camera also fails
          throw new Error("No cameras available");
        }
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setMessage('❌ No camera detected. Please upload an image instead.');
    }
  };

  useEffect(() => {
    setupCamera();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const hasObject = (imageData) => {
    const pixels = imageData.data;
    let colorVariance = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      if (Math.abs(pixels[i] - avg) > 15 || Math.abs(pixels[i + 1] - avg) > 15 || Math.abs(pixels[i + 2] - avg) > 15) {
        colorVariance++;
        if (colorVariance > 5000) return true;
      }
    }
    return false;
  };

  const captureImage = async () => {
    // If there's already a captured image, reset to camera mode
    if (capturedImage) {
      setCapturedImage(null);
      setPrediction('');
      setMessage('');
      
      // Ensure we reinitialize camera when going back
      setTimeout(() => {
        setupCamera();
      }, 100);
      
      return;
    }

    // Check if video is available before capturing
    if (!videoRef.current || !videoRef.current.srcObject) {
      setMessage('❌ No camera detected. Please upload an image instead.');
      return;
    }

    setLoading(true);
    setMessage('');
    setPrediction('');
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Ensure video dimensions are available
    if (videoRef.current.videoWidth === 0) {
      setMessage('❌ Camera not ready yet. Please try again.');
      setLoading(false);
      return;
    }
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    if (!hasObject(imageData)) {
      setMessage('❌ No object detected! Try again.');
      setPrediction('');
      setLoading(false);
      return;
    }

    // Save the captured image URL
    const capturedImageURL = canvas.toDataURL('image/jpeg');
    setCapturedImage(capturedImageURL);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    uploadImage(blob);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setMessage('');
    setPrediction('');

    try {
      // Create a preview of the uploaded image
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);

      // Process the image
      const imageBitmap = await createImageBitmap(file);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      context.drawImage(imageBitmap, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      if (!hasObject(imageData)) {
        setMessage('❌ No object detected! Try another image.');
        setPrediction('');
        setLoading(false);
        return;
      }

      // Upload the image
      uploadImage(file);
    } catch (err) {
      console.error("Error processing uploaded image:", err);
      setMessage('❌ Error processing image. Please try another image.');
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    const token = localStorage.getItem('authToken'); // Get token from storage
  
    try {
      console.log('Uploading image with token:', token);
      
      // Create a blob to ensure we're sending the right data
      let imageBlob;
      if (file instanceof Blob) {
        imageBlob = file;
      } else {
        // If somehow file isn't a blob (shouldn't happen), create one
        const response = await fetch(URL.createObjectURL(file));
        imageBlob = await response.blob();
      }
      
      // Rebuild the FormData with our verified blob
      const verifiedFormData = new FormData();
      verifiedFormData.append('image', imageBlob, 'image.jpg');
      
      // Make the API request
      const res = await axios.post('https://food-classifier-ihbm.onrender.com/predict', verifiedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('API Response:', res.data);
      setPrediction(res.data.prediction);
      setMessage('');
    }
    catch (err) {
      console.error('Upload failed:', err);
      setMessage('⚠️ Upload failed. Try again.');
      setPrediction('');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if the prediction is "No Food Item Is Detected"
  const isNoFoodItem = prediction === "No Food Item Is Detected";
  
  return (
    <div className="app-container" style={{
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
      {/* Add the Navbar component */}
      <Navbar />
      
      <div style={{
        width: '300px',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px',
        color: 'white',
        textAlign: 'center',
        marginTop: '60px' // Add margin to account for fixed navbar
      }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '0',
          marginBottom: '10px',
          background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 'normal'
        }}>🍽️ Food Classifier</h1>

        <div style={{
          marginBottom: '10px',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid #374151',
          height: '160px',
          position: 'relative'
        }}>
          {!capturedImage ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: 'black'
              }} 
            />
          ) : (
            <img 
              src={capturedImage} 
              alt="Captured" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backgroundColor: 'black'
              }}
            />
          )}
        </div>

        <button
          onClick={captureImage}
          disabled={loading || (!capturedImage && !videoRef.current?.srcObject)}
          style={{
            width: '100%',
            padding: '7px 0',
            marginBottom: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: loading || (!capturedImage && !videoRef.current?.srcObject) ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '13px',
            opacity: loading || (!capturedImage && !videoRef.current?.srcObject) ? 0.7 : 1,
            boxSizing: 'border-box'
          }}
        >
          {loading ? 'Processing...' : capturedImage ? '📷 Back to Camera' : '📸 Capture & Upload'}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '8px 0'
        }}>
          <div style={{ height: '1px', backgroundColor: '#4b5563', flex: 1 }}></div>
          <span style={{ margin: '0 8px', fontSize: '11px', color: '#9ca3af' }}>OR</span>
          <div style={{ height: '1px', backgroundColor: '#4b5563', flex: 1 }}></div>
        </div>

        <div style={{ position: 'relative', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={loading}
            id="fileInput"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0,
              zIndex: 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              height: '100%',
              boxSizing: 'border-box'
            }}
          />
          <label htmlFor="fileInput" style={{
            display: 'block',
            width: '100%',
            padding: '7px 0',
            borderRadius: '6px',
            border: 'none',
            background: 'linear-gradient(to right, #3b82f6, #6366f1)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '13px',
            textAlign: 'center',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box',
            opacity: loading ? 0.7 : 1,
          }}>
            🖼️ Upload Image
          </label>
        </div>

        {message && (
          <div style={{
            marginTop: '10px',
            padding: '6px',
            backgroundColor: message.includes('❌') ? 'rgba(234, 179, 8, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            border: message.includes('❌') ? '1px solid #eab308' : '1px solid #3b82f6',
            borderRadius: '6px',
            color: message.includes('❌') ? '#fde047' : '#93c5fd',
            fontSize: '11px',
            boxSizing: 'border-box'
          }}>
            {message}
          </div>
        )}

        {prediction && (
          <div style={{
            marginTop: '10px',
            padding: '6px',
            backgroundColor: isNoFoodItem ? 'rgba(220, 38, 38, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            border: isNoFoodItem ? '1px solid #dc2626' : '1px solid #22c55e',
            borderRadius: '6px',
            color: isNoFoodItem ? '#fca5a5' : '#86efac',
            fontSize: '13px',
            fontWeight: 'bold',
            boxSizing: 'border-box'
          }}>
            {isNoFoodItem ? prediction : `Item: ${prediction}`}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Predict;