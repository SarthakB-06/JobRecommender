import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    setUploading(true);
    setMessage('Uploading resume...');

    try {
      const token = localStorage.getItem('token');
      console.log("Token available:", !!token);

      if (token) {
        console.log("Token format:", token.substring(0, 10) + "...");
      }


      // Step 1: Create FormData with file
      const formData = new FormData();
      formData.append('resume', selectedFile);

      // Step 2: Upload to your server/Cloudinary
      const uploadResponse = await axios.post(
        '/api/v1/users/resume/upload-resume',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Upload response data:', uploadResponse.data);
      
      setMessage('Resume uploaded successfully! Parsing resume...');
      
      // Step 3: Get Cloudinary URL from response
      const cloudinaryUrl = uploadResponse.data.url;
      console.log('Cloudinary URL:', cloudinaryUrl);

      // Step 4: Send URL to Python parser API
      const parserResponse = await axios.post(
        'https://job-recommender-python.onrender.com/parse-resume',
        { url: cloudinaryUrl }
      );

      const handleUploadSuccess = (cloudinaryUrl) => {
        navigate("/dashboard/resume", { state: { resumeUrl: cloudinaryUrl } });
      };

      // Step 5: Handle parsed data
      const parsedResumeData = parserResponse.data.parsedData;
      setParsedData(parsedResumeData);

      await axios.post(
        '/api/v1/users/resume/save-parsed-resume',
        { parsedData: parsedResumeData },
        {
          headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      // Step 6: Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      userData.resumeUploaded = true;
      userData.resumeUrl = cloudinaryUrl;
      userData.parsedData = parsedResumeData;
      localStorage.setItem('userData', JSON.stringify(userData));

      setMessage('Resume parsed successfully!');
      
      // Step 7: Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg">
      {/* Drag & Drop area */}
      <div 
        className={`w-full border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef}
          type="file" 
          id="resume" 
          accept=".pdf,.doc,.docx" 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        <svg className="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        
        <p className="mt-2 text-sm text-gray-600">Drag and drop your resume here, or</p>
        <button
          type="button"
          onClick={onButtonClick}
          className="mt-2 text-sm text-purple-600 hover:text-purple-800"
        >
          Browse files
        </button>
        {selectedFile && (
          <p className="mt-2 text-sm font-medium text-gray-900">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>
      
      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className={`w-full px-6 py-3 text-lg font-medium text-white rounded-md shadow-md ${
          uploading || !selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
        }`}
        style={{ backgroundColor: '#560edd' }}
      >
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>
      
      {message && (
        <div className={`mt-2 p-4 rounded-md w-full ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      {/* {parsedData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md w-full">
          <h3 className="text-xl font-bold mb-2">Parsed Resume Data</h3>
          <p><strong>Name:</strong> {parsedData.name || 'Not detected'}</p>
          <p><strong>Email:</strong> {parsedData.email || 'Not detected'}</p>
          <div>
            <strong>Skills:</strong>
            {parsedData.skills.length > 0 ? (
              <ul className="list-disc pl-5 mt-1">
                {parsedData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">No skills detected</p>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ResumeUpload;