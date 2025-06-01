import React ,{useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import JobRecommendations from './JobRecommendations'
import Sidebar from '../components/Sidebar'
const JobRecommendationsPage = () => {
    const [skills , setSkills] = useState([])
    const [loading , setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                  navigate('/login');
                  return;
                }
        
                // First try to get from localStorage for faster loading
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData?.parsedData?.skills) {
                  setSkills(userData.parsedData.skills);
                  setLoading(false);
                }
        
                // Then fetch fresh data from API
                const response = await axios.get('/api/v1/users/me', {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
        
                if (response.data.success && response.data.parsedResumeData?.skills) {
                  setSkills(response.data.parsedResumeData.skills);
                }
              } catch (error) {
                console.error('Error fetching user data:', error);
                // If API call fails, we'll use whatever we got from localStorage
              } finally {
                setLoading(false);
              }
        }

        fetchUserData()
    },[navigate])

  return (
    <div className='flex w-full gap-5'>
      <Sidebar/>
      <div className='flex-1 p-5' id='main-content'>
        <h1 className='text-2xl font-semibold mb-4' style={{color:'#560edd'}}>
            Job Recommendations
        </h1>

        {loading ? (
            <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        ):(
            <JobRecommendations 
            skills={skills}
            limit={20}
            dashboardView={false}
             />
        )}
      </div>
    </div>
  )
}

export default JobRecommendationsPage
