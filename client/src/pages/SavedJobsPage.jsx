import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Calendar, ExternalLink, BookmarkX, Tag, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast'; // Import if you're using toast

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, [navigate]);

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

  const handleRemoveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Set removing state for this job
      setRemoving(prev => ({ ...prev, [jobId]: true }));
      
      const response = await axios.delete(`/api/v1/jobs/unsave/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Remove from saved jobs list
        setSavedJobs(prev => prev.filter(job => job.jobId !== jobId));
        toast.success('Job removed from saved jobs');
      }
    } catch (error) {
      toast.error('Error removing job');
      console.error('Error removing saved job:', error);
    } finally {
      // Clear removing state for this job
      setRemoving(prev => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });
    }
  };

  return (
    <div className="flex w-full gap-5">
      <Sidebar />
      <div className="flex-1 p-5" id="main-content">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: '#560edd' }}>
          Saved Jobs
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
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No saved jobs yet</h2>
            <p className="text-gray-600 mb-4">
              Jobs you save will appear here so you can easily find them later.
            </p>
            <button
              onClick={() => navigate('/dashboard/recommendations')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {savedJobs.map((job) => (
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
                  
                  {/* Remove button */}
                  <button 
                    onClick={() => handleRemoveJob(job.jobId)}
                    disabled={removing[job.jobId]}
                    className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                    title="Remove from saved jobs"
                  >
                    {removing[job.jobId] ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-red-600"></div>
                    ) : (
                      <BookmarkX size={20} />
                    )}
                  </button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.salary && (
                    <span className="inline-flex items-center text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                      <DollarSign size={14} className="mr-1" />
                      {job.salary}
                    </span>
                  )}
                  
                  {job.jobType && (
                    <span className="inline-flex items-center text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      <Calendar size={14} className="mr-1" />
                      {job.jobType}
                    </span>
                  )}
                  
                  {job.matchScore && (
                    <span className="inline-flex items-center text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      <Tag size={14} className="mr-1" />
                      {Math.round(job.matchScore)}% Match
                    </span>
                  )}
                </div>
                
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Skills:</h3>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 5 && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          +{job.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
                  >
                    Apply Now
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;