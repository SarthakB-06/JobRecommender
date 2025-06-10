// In client/src/pages/SkillGapAnalysisPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Award, 
  AlertCircle, 
  Check, 
  X, 
  TrendingUp, 
  Briefcase, 
  Building,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const SkillGapAnalysisPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();
  const { jobId } = useParams(); // Get jobId from URL
  
  useEffect(() => {
    if (!jobId) {
      setError('No job selected. Please select a job to analyze.');
      setLoading(false);
      return;
    }
    
    fetchSkillGapAnalysis();
  }, [jobId]);
  
  const fetchSkillGapAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`/api/v1/jobs/skill-gap/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setAnalysis(response.data.data);
      } else {
        setError(response.data.message || 'Failed to analyze skill gaps');
      }
    } catch (error) {
      console.error('Error fetching skill gap analysis:', error);
      setError(error.response?.data?.message || 'Failed to analyze skill gaps');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full gap-5">
      <Sidebar />
      <div className="flex-1 p-5" id="main-content">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: '#560edd' }}>
          Skill Gap Analysis
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        ) : analysis ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase size={20} className="text-purple-600" />
                <h2 className="text-xl font-semibold">{analysis.job.title}</h2>
              </div>
              
              <div className="flex items-center space-x-2 mb-4 text-gray-600">
                <Building size={16} />
                <span>{analysis.job.company}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Job Description</h3>
                <p className="text-gray-600 text-sm">
                  {analysis.job.description.substring(0, 300)}
                  {analysis.job.description.length > 300 ? '...' : ''}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Skills Match</h3>
                  <div className={`
                    text-lg font-bold px-3 py-1 rounded-md ${
                      analysis.matchPercentage >= 70 ? 'bg-green-100 text-green-800' :
                      analysis.matchPercentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  `}>
                    {analysis.matchPercentage}% Match
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${analysis.matchPercentage}%` }}
                      className={`
                        shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                        ${
                          analysis.matchPercentage >= 70 ? 'bg-green-500' :
                          analysis.matchPercentage >= 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }
                      `}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-3">
                    <Check size={18} className="text-green-600 mr-2" />
                    <h3 className="text-lg font-medium">Skills You Have</h3>
                  </div>
                  
                  {analysis.matchedSkills.length > 0 ? (
                    <div className="space-y-2">
                      {analysis.matchedSkills.map(skill => (
                        <div key={skill} className="bg-green-50 border border-green-100 rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <span>{skill}</span>
                            <Check size={16} className="text-green-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 rounded-md text-yellow-700 text-sm">
                      None of your current skills match the requirements for this job.
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <TrendingUp size={18} className="text-red-600 mr-2" />
                    <h3 className="text-lg font-medium">Skills to Develop</h3>
                  </div>
                  
                  {analysis.missingSkills.length > 0 ? (
                    <div className="space-y-2">
                      {analysis.missingSkills.map(skill => (
                        <div key={skill} className="bg-red-50 border border-red-100 rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <span>{skill}</span>
                            <X size={16} className="text-red-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 rounded-md text-green-700 text-sm">
                      Great job! You have all the required skills for this position.
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {analysis.missingSkills.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
                <p className="text-gray-600 mb-4">
                  Here are some resources to help you develop the skills you're missing:
                </p>
                
                <div className="space-y-4">
                  {analysis.missingSkills.slice(0, 3).map(skill => (
                    <div key={skill} className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{skill}</h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <BookOpen size={16} className="text-purple-600 mt-1 mr-2" />
                          <div>
                            <p className="font-medium">Online Courses</p>
                            <p className="text-sm text-gray-600">
                              Learn {skill} through platforms like Udemy, Coursera, or LinkedIn Learning.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Award size={16} className="text-purple-600 mt-1 mr-2" />
                          <div>
                            <p className="font-medium">Certifications</p>
                            <p className="text-sm text-gray-600">
                              Consider getting certified in {skill} to stand out from other candidates.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No Job Selected</h2>
            <p className="text-gray-600 mb-4">
              Please select a job from your recommendations or saved jobs to analyze skill gaps.
            </p>
            <button
              onClick={() => navigate('/dashboard/recommendations')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysisPage;