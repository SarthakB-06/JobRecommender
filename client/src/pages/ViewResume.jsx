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
  const [parsedData, setParsedData] = useState(null);

  
  const formatText = (text) => {
    if (!text) return '';
    
    // Add spaces between camelCase words
    let formatted = text.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Add spaces between letters and numbers
    formatted = formatted.replace(/([a-zA-Z])(\d)/g, '$1 $2');
    formatted = formatted.replace(/(\d)([a-zA-Z])/g, '$1 $2');
    
    // Fix common punctuation issues
    formatted = formatted.replace(/([.,;:])([a-zA-Z])/g, '$1 $2');
    
    // Fix pipe character spacing
    formatted = formatted.replace(/\|/g, ' | ');
    
    return formatted;
  };

  // Helper to create bullet points from text
  const createBulletPoints = (text) => {
    if (!text) return [];
    
    // Format the text first
    let formatted = formatText(text);
    
    // Try to split by periods or bullet points
    const bullets = formatted.split(/\.|•/).filter(item => item.trim().length > 0);
    
    // If we couldn't split effectively, try to split by capital letters for long text
    if (bullets.length <= 1 && formatted.length > 100) {
      return formatted
        .split(/(?=[A-Z][a-z])/)
        .filter(s => s.trim().length > 15)
        .map(s => s.trim());
    }
    
    return bullets.map(item => item.trim());
  };

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
        
        // Store parsed data for rendering
        setParsedData(userResponse.data.parsedResumeData);
        
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(err.response?.data?.message || "Failed to fetch resume data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [navigate, resumeUrl]);

  const downloadAsText = () => {
    if (!parsedData) return;
    
    // Create a well-formatted text version
    const text = formatDataForDownload(parsedData);
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format data for downloading as text
  const formatDataForDownload = (data) => {
    let text = '';
    
    // Personal info
    if (data.name) text += `${formatText(data.name)}\n`;
    if (data.email) text += `${data.email}\n`;
    if (data.phone) text += `${data.phone}\n`;
    if (data.location) text += `${formatText(data.location)}\n\n`;
    
    // Skills
    if (data.skills && data.skills.length > 0) {
      text += `SKILLS\n`;
      const formattedSkills = data.skills.map(skill => formatText(skill));
      text += `${formattedSkills.join(', ')}\n\n`;
    }
    
    // Experience
    if (data.experience && data.experience.length > 0) {
      text += `EXPERIENCE\n\n`;
      data.experience.forEach(exp => {
        if (exp.title) text += `${formatText(exp.title)}`;
        if (exp.company) text += ` at ${formatText(exp.company)}`;
        text += `\n`;
        if (exp.date) text += `${exp.date}\n`;
        
        if (exp.description) {
          const bullets = createBulletPoints(exp.description);
          bullets.forEach(bullet => {
            text += `• ${bullet}\n`;
          });
        }
        text += `\n`;
      });
    }
    
    // Education
    if (data.education && data.education.length > 0) {
      text += `EDUCATION\n\n`;
      data.education.forEach(edu => {
        if (edu.degree) text += `${formatText(edu.degree)}`;
        if (edu.institution) text += ` - ${formatText(edu.institution)}`;
        text += `\n`;
        if (edu.date || edu.year) text += `${edu.date || edu.year}\n`;
        text += `\n`;
      });
    }
    
    // Projects
    if (data.projects && data.projects.length > 0) {
      text += `PROJECTS\n\n`;
      data.projects.forEach(project => {
        if (project.name) text += `${formatText(project.name)}\n`;
        
        if (project.description) {
          const bullets = createBulletPoints(project.description);
          bullets.forEach(bullet => {
            text += `• ${bullet}\n`;
          });
        }
        text += `\n`;
      });
    }
    
    return text;
  };

  // Render bullet points for descriptions
  const renderBulletPoints = (text) => {
    const bullets = createBulletPoints(text);
    
    return (
      <div className="ml-2">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-baseline mb-1">
            <span className="text-purple-500 mr-2">•</span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    );
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
            
            {parsedData && (
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
            ) : parsedData ? (
              <div className="p-6">
                {/* Header with file info */}
                <div className="flex items-start mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <FileText size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">Resume Content</h2>
                    <p className="text-sm text-gray-500">Formatted from parsed resume data</p>
                  </div>
                </div>
                
                {/* Resume content */}
                <div className="resume-content space-y-6">
                  {/* Personal Info */}
                  <div className="mb-6">
                    {parsedData.name && (
                      <h2 className="text-xl font-bold text-gray-800">
                        {formatText(parsedData.name)}
                      </h2>
                    )}
                    <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                      {parsedData.email && <span>{parsedData.email}</span>}
                      {parsedData.phone && <span>{parsedData.phone}</span>}
                      {parsedData.location && <span>{formatText(parsedData.location)}</span>}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  {parsedData.skills && parsedData.skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.map((skill, index) => (
                          <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {formatText(skill)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Experience */}
                  {parsedData.experience && parsedData.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-1">Experience</h2>
                      {parsedData.experience.map((exp, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex justify-between mb-1">
                            <h3 className="text-lg font-medium">{formatText(exp.title)}</h3>
                            {exp.company && (
                              <span className="text-purple-600">{formatText(exp.company)}</span>
                            )}
                          </div>
                          {exp.date && <p className="text-sm text-gray-500 mb-2">{exp.date}</p>}
                          {exp.description && renderBulletPoints(exp.description)}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Education */}
                  {parsedData.education && parsedData.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-1">Education</h2>
                      {parsedData.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-medium">{formatText(edu.degree)}</h3>
                            {edu.institution && <span>{formatText(edu.institution)}</span>}
                          </div>
                          {(edu.date || edu.year) && (
                            <p className="text-sm text-gray-500">{edu.date || edu.year}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Projects */}
                  {parsedData.projects && parsedData.projects.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-1">Projects</h2>
                      {parsedData.projects.map((project, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="font-medium mb-1">{formatText(project.name)}</h3>
                          {project.description && renderBulletPoints(project.description)}
                        </div>
                      ))}
                    </div>
                  )}
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