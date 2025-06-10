import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Calendar, Bookmark,TrendingUp , BookmarkCheck, Percent, ExternalLink, Globe, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const JobRecommendations = ({ skills }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [location, setLocation] = useState('');
  const [savedJobs, setSavedJobs] = useState({});
  const [savingJobs, setSavingJobs] = useState({});
  const navigate = useNavigate();





  const popularCities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
    'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Noida'
  ];

  const handleSaveJob = async (job, isSaved) => {
    try {
      console.log("Full job object:", job);

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please log in to save jobs');
        navigate('/login');
        return;
      }


      setSavingJobs(prev => ({ ...prev, [job._id]: true }));

      if (isSaved) {

        const response = await axios.delete(`/api/v1/jobs/unsave/${job._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {

          setSavedJobs(prev => {
            const updated = { ...prev };
            delete updated[job._id];
            return updated;
          });
          toast.success('Job removed from saved jobs');
        }
      } else {

        const jobData = {
          jobId: job._id,
          title: job.title,
          company: job.company,
          location: job.location || '',
          salary: typeof job.salary === 'object' ? `${job.salary.min || ''}-${job.salary.max || ''}` : (job.salary || ''),
          link: job.url || '',
          description: job.description || '',
          skills: job.matchingSkills || [],
          datePosted: job.datePosted || '',
          jobType: job.type || '',
          matchScore: job.matchPercentage || 0
        };

        console.log("Sending job data to server:", jobData);

        const response = await axios.post('/api/v1/jobs/save', jobData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Save response:", response.data);

        if (response.data.success) {

          setSavedJobs(prev => ({ ...prev, [job._id]: true }));
          toast.success('Job saved successfully');
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      toast.error('Error saving job');
    } finally {

      setSavingJobs(prev => {
        const updated = { ...prev };
        delete updated[job._id];
        return updated;
      });
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/api/v1/jobs/recommendations', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            page,
            location
          }
        });

        console.log("Job recommendations response:", response.data);

        if (response.data.success) {
          setRecommendations(response.data.recommendations);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setError("Could not load job recommendations");
        }

        fetchSavedJobIds()


      } catch (error) {
        console.error("Error fetching job recommendations:", error);
        setError(error.response?.data?.message || "Failed to fetch job recommendations");
      } finally {
        setLoading(false);
      }
    };
    const fetchSavedJobIds = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          return;
        }

        const response = await axios.get('/api/v1/jobs/saved', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {

          const savedJobMap = {};
          response.data.savedJobs.forEach(job => {
            savedJobMap[job.jobId] = true;
          });
          setSavedJobs(savedJobMap);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };





    if (skills && skills.length > 0) {
      fetchRecommendations();
    } else {
      setLoading(false);
      setError("No skills found in your profile to match jobs");
    }
  }, [navigate, page, location, skills]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Not specified";

    // Format as lakhs for Indian salaries
    const formatInLakhs = (value) => {
      if (!value) return "";
      const lakhs = (value / 100000).toFixed(1);
      return `₹${lakhs}L`;
    };

    if (min && max) {
      return `${formatInLakhs(min)} - ${formatInLakhs(max)}`;
    } else if (min) {
      return `${formatInLakhs(min)}+`;
    } else {
      return `Up to ${formatInLakhs(max)}`;
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setPage(1); // Reset to first page when changing location
  };

  const openExternalJob = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }



  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by location
        </label>
        <select
          value={location}
          onChange={handleLocationChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All India</option>
          {popularCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700">No job recommendations found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {recommendations.map((job) => (
              <div key={job._id} className="bg-white shadow hover:shadow-md rounded-lg p-4 transition duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Briefcase size={14} className="mr-1" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin size={14} className="mr-1" />
                      <span>{job.location}</span>

                      {/* Show remote badge if job is remote - NEW */}
                      {job.isRemote && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          <Globe size={10} className="inline mr-1" />
                          Remote
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${job.matchPercentage >= 80 ? 'bg-green-100 text-green-800' :
                        job.matchPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                    `}>
                      <Percent size={14} className="mr-1" />
                      {job.matchPercentage}% Match
                    </div>
                    <button
                      onClick={() => handleSaveJob(job, savedJobs[job._id])}
                      disabled={savingJobs[job._id]}
                      className={`p-2 rounded-full ${savedJobs[job._id]
                        ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {savingJobs[job._id] ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-purple-600"></div>
                      ) : savedJobs[job._id] ? (
                        <BookmarkCheck size={20} />
                      ) : (
                        <Bookmark size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {job.description?.substring(0, 150)}
                  {job.description?.length > 150 ? '...' : ''}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {job.matchingSkills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {job.matchingSkills?.length > 3 && (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      +{job.matchingSkills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap justify-between items-center text-sm">
                  <div className="flex items-center text-gray-600 mb-1 md:mb-0">
                    <DollarSign size={14} className="mr-1" />
                    {formatSalary(job.salary?.min, job.salary?.max)}
                  </div>
                  <div className="flex items-center text-gray-600 mb-1 md:mb-0">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(job.datePosted)}
                  </div>

                  {/* Job publisher info - NEW */}
                  {job.publisher && (
                    <div className="flex items-center text-gray-600">
                      <Tag size={14} className="mr-1" />
                      {job.publisher}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => job.url ? openExternalJob(job.url) : null}
                    className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                    disabled={!job.url}
                  >
                    Apply Now <ExternalLink size={14} className="ml-1" />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/skill-gap/${job._id}`)}
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 ml-4"
                  >
                    <TrendingUp size={14} className="mr-1" />
                    Analyze Skills
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobRecommendations;