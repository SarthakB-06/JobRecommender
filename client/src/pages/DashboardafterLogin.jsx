import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import JobRecommendations from './JobRecommendations';
const DashboardafterLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Start with data from localStorage to show something quickly
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData?.parsedData) {
          setParsedData(userData.parsedData);
        }

        // Then fetch fresh data from the API
        const response = await axios.get('/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API response:', response.data);


        if (response.data.success) {
          // Log the exact data structure 
          // console.log('parsedResumeData structure:', JSON.stringify(response.data.parsedResumeData, null, 2));

          // Make sure it has the expected properties before setting state
          if (response.data.parsedResumeData) {
            // Create a properly formatted object before setting state
            const formattedData = {
              name: response.data.parsedResumeData.name || 'Not available',
              email: response.data.parsedResumeData.email || 'Not available',
              phone: response.data.parsedResumeData.phone || null,
              location: response.data.parsedResumeData.location || null,
              skills: Array.isArray(response.data.parsedResumeData.skills)
                ? response.data.parsedResumeData.skills
                : [],
              experience: Array.isArray(response.data.parsedResumeData.experience)
                ? response.data.parsedResumeData.experience
                : [],
              education: Array.isArray(response.data.parsedResumeData.education)
                ? response.data.parsedResumeData.education
                : [],
              projects: Array.isArray(response.data.parsedResumeData.projects)
                ? response.data.parsedResumeData.projects
                : []
            };

            console.log('Formatted data for state:', formattedData);
            setParsedData(formattedData);

            // Update localStorage with properly formatted data
            const freshUserData = {
              ...userData,
              parsedData: formattedData,
              resumeUrl: response.data.resumeUrl,
              resumeUploaded: response.data.resumeUploaded
            };
            localStorage.setItem('userData', JSON.stringify(freshUserData));
          } else {
            console.warn('parsedResumeData is null or undefined in the response');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load your profile data. Please try again later.');

        // If API fails, we'll use whatever we have in localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData?.parsedData) {
          setParsedData(userData.parsedData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Add this after your other useEffect
  useEffect(() => {
    console.log('parsedData state changed:', parsedData);
    // Force a re-render if needed
    if (parsedData) {
      setLoading(false);
    }
  }, [parsedData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const skillCount = parsedData?.skills?.length || 0;
  const experienceCount = parsedData?.experience?.length || 0;
  const educationCount = parsedData?.education?.length || 0;

  return (


    <div className="flex">
      <Sidebar />
      {/* <h1 className="text-3xl font-bold mb-6" style={{ color: '#560edd' }}>Your Dashboard</h1> */}

      <div id='main-content' className='w-full p-4 transition-all duration-300'>

      
      {parsedData ? (
        <div style={{ color: '#560edd' }} className='space-y-6 mt-5 '>

          <div className='flex justify-between '>

          
          <div className='flex flex-col justify-center items-start'>
            <h1 style={{ color: '#560edd' }} className='text-3xl font-semibold '>Welcome back, {parsedData?.name || 'User'}👋</h1>
            <p className='mt-1 text-gray-600'>Let's help you find your dream job today</p>
          </div>
          <div>
            <button onClick={()=> navigate('/login')}  style={{backgroundColor:"#560edd"}} className='px-5 py-2 font-semibold cursor-pointer text-white rounded-md'>Logout</button>
          </div>
          </div>
          


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-xl p-4">
              <p className="text-sm text-gray-500">Skills Detected</p>
              <h2 className="text-2xl font-semibold ">{skillCount}</h2>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <p className="text-sm text-gray-500">Experience Entries</p>
              <h2 className="text-2xl font-semibold ">{experienceCount}</h2>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <p className="text-sm text-gray-500">Education Listed</p>
              <h2 className="text-2xl font-semibold ">{educationCount}</h2>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <button style={{ backgroundColor: '#560edd' }} className='text-white p-4 rounded-lg shadow hover:bg-purple-700 transition duration-200'>
              Find Matching Jobs
            </button>

            <button
              onClick={() => navigate('/dashboard/resume')}
              className="bg-white border border-purple-200 p-4 rounded-lg shadow hover:bg-purple-50"
            >
              📝 View or Improve Resume
            </button>
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="bg-white border border-purple-200 p-4 rounded-lg shadow hover:bg-purple-50"
            >
              👤 Edit Profile Info
            </button>

          </div>



          <div className="mt-6 grid grid-cols3 ">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#560edd' }}>Job Recommendations Based on Your Skills</h2>
            <div className=' '>

            <JobRecommendations skills={parsedData?.skills || []} />
            </div>
          </div>





        </div>


        // <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        //   <h2 className="text-2xl font-bold mb-4">Your Resume Analysis</h2>

        //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        //     <div>
        //       <h3 className="text-xl font-bold mb-2">Personal Information</h3>
        //       <p><strong>Name:</strong> {parsedData.name}</p>
        //       <p><strong>Email:</strong> {parsedData.email}</p>
        //       {parsedData.phone && <p><strong>Phone:</strong> {parsedData.phone}</p>}
        //       {parsedData.location && <p><strong>Location:</strong> {parsedData.location}</p>}
        //     </div>

        //     <div>
        //       <h3 className="text-xl font-bold mb-2">Skills</h3>
        //       <div className="flex flex-wrap gap-2">
        //         {parsedData.skills.map((skill, index) => (
        //           <span
        //             key={index}
        //             className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
        //           >
        //             {skill}
        //           </span>
        //         ))}
        //       </div>
        //     </div>
        //   </div>

        //   {parsedData.experience?.length > 0 && (
        //     <div className="mt-6">
        //       <h3 className="text-xl font-bold mb-2">Experience</h3>
        //       <ul className="space-y-4">
        //         {parsedData.experience.map((exp, index) => (
        //           <li key={index} className="border-l-4 border-purple-200 pl-4">
        //             <p className="font-bold">{exp.title || 'Position'}</p>
        //             <p>{exp.company || 'Company'}</p>
        //             <p className="text-sm text-gray-600">{exp.duration || 'Duration not specified'}</p>
        //           </li>
        //         ))}
        //       </ul>
        //     </div>

        //   )}

        //   {parsedData.education?.length > 0 && (
        //     <div className="mt-6">
        //       <h3 className="text-xl font-bold mb-2">Education</h3>
        //       <ul className="space-y-4">
        //         {parsedData.education.map((edu, index) => (
        //           <li key={index} className="border-l-4 border-purple-200 pl-4">
        //             <p className="font-bold">{edu.degree || 'Degree'}</p>
        //             <p>{edu.institution || 'Institution'}</p>
        //             <p className="text-sm text-gray-600">{edu.year || 'Year not specified'}</p>
        //           </li>
        //         ))}
        //       </ul>
        //     </div>
        //   )}

        //   {parsedData.projects?.length > 0 && (
        //     <div className="mt-6">
        //       <h3 className="text-xl font-bold mb-2">Projects</h3>
        //       <ul className="space-y-4">
        //         {parsedData.projects.map((project, index) => (
        //           <li key={index} className="border-l-4 border-purple-200 pl-4">
        //             <p className="font-bold">{project.name || 'Project'}</p>
        //             {project.description && (
        //               <p className="text-sm text-gray-600">{project.description}</p>
        //             )}
        //           </li>
        //         ))}
        //       </ul>
        //     </div>
        //   )}
        // </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            You haven't uploaded your resume yet. Upload your resume to see personalized job recommendations.
          </p>
          <button
            onClick={() => navigate('/dashboard/register')}
            className='mt-4 bg-purple-600 text-white px-4 py-2 rounded-md'
          >
            Upload Resume

          </button>
        </div>
      )}

      {/* Rest of your dashboard content */}
      </div>
    </div>
  );
};

export default DashboardafterLogin;
