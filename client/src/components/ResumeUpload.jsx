import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Only store file here
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  // This function runs when "Upload Resume" button is clicked
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setUploading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post('/api/v1/users/resume/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Resume uploaded successfully!');
      const userData = JSON.parse(localStorage.getItem('userData'));
      userData.resumeUploaded = true;
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      setMessage('Upload failed.');
      console.error(error);
    } finally {
      setUploading(false);
      setSelectedFile(null); // optional: clear selected file
    }
  };

  return (
    <div style={{ border: '2px dashed #aaa', padding: '2rem', textAlign: 'center' }}>
      <div {...getRootProps()} style={{ cursor: 'pointer' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your resume here...</p>
        ) : (
          <p>Drag & drop your PDF resume here, or click to select one</p>
        )}
      </div>

      {selectedFile && <p>Selected file: {selectedFile.name}</p>}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ResumeUpload;
