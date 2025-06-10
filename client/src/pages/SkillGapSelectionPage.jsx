// In client/src/pages/SkillGapSelectionPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Search, AlertCircle, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast';

const SkillGapSelectionPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get('/api/v1/jobs/saved', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setSavedJobs(response.data.savedJobs);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setError('Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = (jobId) => {
    navigate(`/dashboard/skill-gap/${jobId}`);
  };

  const filteredJobs = savedJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-full gap-5">
      <Sidebar />
      <div className="flex-1 p-5" id="main-content">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: '#560edd' }}>
          Skill Gap Analysis
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <p className="text-gray-600 mb-4">
            Select a job from your saved jobs to analyze how your skills match with the job requirements.
          </p>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search saved jobs..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md flex items-center text-red-700">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No saved jobs yet</h2>
            <p className="text-gray-600 mb-4">
              Save some jobs first to analyze skill gaps.
            </p>
            <button
              onClick={() => navigate('/dashboard/recommendations')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-yellow-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No matching jobs</h2>
            <p className="text-gray-600 mb-4">
              No jobs match your search criteria.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <div key={job.jobId} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                    
                    <div className="flex items-center mt-1 text-gray-600">
                      <Briefcase size={16} className="mr-1" />
                      <span className="mr-4">{job.company}</span>
                      
                      {job.location && (
                        <>
                          <MapPin size={16} className="mr-1" />
                          <span>{job.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSelectJob(job.jobId)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <TrendingUp size={16} className="mr-1" />
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapSelectionPage;