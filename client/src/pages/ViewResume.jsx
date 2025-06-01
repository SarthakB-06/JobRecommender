import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, Eye, FileText, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

function ViewResume() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedUrl = location.state?.resumeUrl || "";
  const [resumeUrl] = useState(passedUrl);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        console.log("Fetching resume content...");

        const token = localStorage.getItem('token');
    
        if (!token) {
          setError("You are not logged in. Please log in to view your resume.");
          setLoading(false);
          navigate('/login');
          return;
        }
        
        // Get user profile data which contains parsedResumeData
        const userResponse = await axios.get('/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        
        if (!userResponse.data.success) {
          setError("Failed to fetch user data");
          setLoading(false);
          return;
        }
        
        const userData = userResponse.data;
        console.log("User data received:", userData);
        
        // Check if we have parsed resume data
        if (!userData.parsedResumeData) {
          setError("No resume data found. Please upload a resume first.");
          setLoading(false);
          return;
        }
        
        // Format the parsed data into readable text
        const formattedText = formatParsedDataToText(userData.parsedResumeData);
        setResumeText(formattedText);
        
        // Set URL if available but not passed
        if (!resumeUrl && userData.resumeUrl) {
          console.log("Found resume URL in user data:", userData.resumeUrl);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(err.response?.data?.message || "Failed to fetch resume data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeUrl]);

  // Function to format parsed data into readable text
  const formatParsedDataToText = (parsedData) => {
    let text = '';
    
    // Add name and contact info
    if (parsedData.name) text += `${parsedData.name}\n`;
    if (parsedData.email) text += `${parsedData.email}\n`;
    if (parsedData.phone) text += `${parsedData.phone}\n`;
    if (parsedData.location) text += `${parsedData.location}\n\n`;
    
    // Add skills
    if (parsedData.skills && parsedData.skills.length > 0) {
      text += `SKILLS\n`;
      text += `${parsedData.skills.join(', ')}\n\n`;
    }
    
    // Add experience
    if (parsedData.experience && parsedData.experience.length > 0) {
      text += `EXPERIENCE\n`;
      parsedData.experience.forEach(exp => {
        if (exp.title) text += `${exp.title}`;
        if (exp.company) text += ` at ${exp.company}`;
        text += `\n`;
        if (exp.date) text += `${exp.date}\n`;
        if (exp.description) text += `${exp.description}\n`;
        text += `\n`;
      });
    }
    
    // Add education
    if (parsedData.education && parsedData.education.length > 0) {
      text += `EDUCATION\n`;
      parsedData.education.forEach(edu => {
        if (edu.degree) text += `${edu.degree}`;
        if (edu.institution) text += ` - ${edu.institution}`;
        text += `\n`;
        if (edu.date || edu.year) text += `${edu.date || edu.year}\n`;
        text += `\n`;
      });
    }
    
    // Add projects
    if (parsedData.projects && parsedData.projects.length > 0) {
      text += `PROJECTS\n`;
      parsedData.projects.forEach(project => {
        if (project.name) text += `${project.name}\n`;
        if (project.description) text += `${project.description}\n`;
        text += `\n`;
      });
    }
    
    return text;
  };

  const downloadAsText = () => {
    if (!resumeText) return;
    
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format the resume text for better display
  const formatResumeText = (text) => {
    if (!text) return [];
    
    // Split by double newlines to separate sections
    const sections = text.split(/\n\s*\n/);
    
    return sections.map((section, index) => (
      <div key={index} className="mb-4">
        {section.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line.trim() ? (
              <div className={line.toUpperCase() === line && line.length > 3 ? 
                "font-bold text-gray-800 mb-1" : "text-gray-700"}>
                {line}
              </div>
            ) : <br />}
          </React.Fragment>
        ))}
      </div>
    ));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back
            </button>
            
            <h1 className="text-2xl font-semibold text-purple-800">Resume Viewer</h1>
            
            {resumeText && (
              <button
                onClick={downloadAsText}
                className="flex items-center text-purple-600 hover:text-purple-800"
              >
                <Download size={18} className="mr-1" />
                Download
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading resume content...</p>
              </div>
            ) : error ? (
              <div className="p-8">
                <div className="flex items-center justify-center text-red-500 mb-4">
                  <AlertCircle size={40} />
                </div>
                <p className="text-center text-red-600 font-medium mb-2">Error</p>
                <p className="text-center text-gray-600">{error}</p>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/dashboard/resume')}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Go to Resume Page
                  </button>
                </div>
              </div>
            ) : resumeText ? (
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <FileText size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">Resume Content</h2>
                    {resumeUrl && (
                      <p className="text-sm text-gray-500">Extracted from parsed resume data</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <div className="resume-content font-mono text-sm whitespace-pre-wrap">
                    {formatResumeText(resumeText)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center text-yellow-500 mb-4">
                  <Eye size={40} />
                </div>
                <p className="text-gray-600">No resume content available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewResume;