import { useState } from 'react'
import Navbar from './Navbar'
import LoginAndRegister from './pages/LoginAndRegister'
import axios from 'axios';
import DashboardbeforeLogin from './pages/DashboardbeforeLogin';
import DashboardafterLogin from './pages/DashboardafterLogin';
import LandingPage from './pages/LandingPage';
// import JobRecommendations from './pages/JobRecommendations';
import JobRecommendationsPage from './pages/JobRecommendationsPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewResume from './pages/ViewResume';
import SavedJobsPage from './pages/SavedJobsPage';
import SkillGapSelectionPage from './pages/SkillGapSelectionPage';
import SkillGapAnalysisPage from './pages/SkillGapAnalysisPage';
import { Toaster } from 'react-hot-toast';
import SettingsPage from './pages/SettingsPage';


function App() {
  axios.defaults.baseURL = 'https://job-recommender-nodejs.onrender.com';
  axios.defaults.withCredentials = true;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginAndRegister />} />
        <Route path="/dashboard/register" element={< DashboardbeforeLogin />} />
        <Route path="/dashboard" element={< DashboardafterLogin />} />
        {/* <Route path="/dashboard/resume" element={<DashboardafterLogin />} /> */}
        <Route path="/dashboard/recommendations" element={<JobRecommendationsPage />} />
        <Route path='/dashboard/resume' element={<ViewResume />} />
        <Route path='/dashboard/saved-jobs' element={<SavedJobsPage />} />
        <Route path="/dashboard/skill-gap" element={<SkillGapSelectionPage />} />

        <Route
          path="/dashboard/skill-gap/:jobId"
          element={

            <SkillGapAnalysisPage />

          }
        />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        

       
      </Routes>
      <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
            },
            success: {
              icon: '✅',
              style: {
                border: '1px solid #10B981',
                padding: '16px',
              },
            },
            error: {
              icon: '❌',
              style: {
                border: '1px solid #EF4444',
                padding: '16px',
              },
            },
          }}
        />
    </Router>
    

  )
}

export default App
