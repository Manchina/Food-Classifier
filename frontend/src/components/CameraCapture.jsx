import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: 'environment',
};

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState('');
  const [captured, setCaptured] = useState(null);

  // 📸 Capture from webcam
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const hasObject = await validateObject(imageSrc);
    if (!hasObject) {
      setMessage("No object detected! Try again.");
      return;
    }

    setCaptured(imageSrc);
    uploadToBackend(imageSrc);
  }, [webcamRef]);

  // 📤 Upload file from device
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setCaptured(imageUrl);
    uploadToBackend(imageUrl, file);
  };

  // ✅ Dummy object check (can replace with real detection)
  const validateObject = async (imageBase64) => {
    return true; // Assume always valid for now
  };

  // 🚀 Send to backend
  const uploadToBackend = async (imageBase64, uploadedFile = null) => {
    try {
      const blob = uploadedFile ? uploadedFile : await (await fetch(imageBase64)).blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/predict", formData);
      setMessage(`Prediction: ${res.data.class}`);
    } catch (err) {
      setMessage("Error uploading image");
      console.error(err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1rem'
    }}>
      <Webcam
        audio={false}
        height={300}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>📸 Capture & Upload</button>
      <p>OR</p>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {captured && <img src={captured} alt="Captured" width="200" style={{ marginTop: '1rem' }} />}
      <p>{message}</p>
    </div>
  );
};

export default CameraCapture;
