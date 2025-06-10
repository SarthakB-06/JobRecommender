import React from 'react'
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Home, X, AlignJustify, FileText, Brain, BarChart, Search, Briefcase, Settings } from 'lucide-react';

const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      // Make the logout API call with proper headers
      const response = await axios.post('/api/v1/users/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Logout response:", response.data);
      localStorage.removeItem('token');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      navigate('/login');
      toast.error('Logged out with errors');
    }
  };
  const menuItems = [
    { label: 'Dashboard', icon: <Home size={25} />, to: '/dashboard' },
    { label: 'My Resume', icon: <Brain size={25} />, to: '/dashboard/resume' },
    { label: 'Job Recommendations', icon: <FileText size={25} />, to: '/dashboard/recommendations' },

    { label: 'Skill Gap Analysis', icon: <Search size={25} />, to: '/dashboard/skill-gap' },
    { label: 'Saved Jobs', icon: <Briefcase size={25} />, to: '/dashboard/saved-jobs' },
    { label: 'Settings', icon: <Settings size={25} />, to: '/dashboard/settings' },
    
  ];

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.style.marginLeft = isOpen ? '16rem' : '5rem';
    }

    return () => {
      // Cleanup - reset margin when unmounting
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    };
  }, [isOpen]);

  return (
    <div className={`h-screen  ${isOpen ? 'bg-white' : 'bg-gray-100'} shadow-lg fixed top-0 left-0 z-50 translate-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {isOpen ? (
        <>

          <div className="absolute top-0 right-0 p-2">
            <button onClick={() => setIsOpen(false)}>
              <X size={25} className="text-purple-600 " />
            </button>
          </div>

          <h1 className="text-xl font-bold ml-5 mt-7 mb-5 text-purple-700">Job Recommender AI</h1>
        </>
      ) : (
        <div className="flex justify-center p-3 mt-2">
          <button onClick={() => setIsOpen(true)}>
            <AlignJustify size={25} className="text-purple-600" />
          </button>
        </div>
      )}

      <nav className="space-y-2 ">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-purple-100 ${isActive ? 'bg-purple-200 text-purple-800  font-semibold' : 'text-gray-700'
              } ${!isOpen ? 'justify-center' : ''} `
            }
          >
            {item.icon}
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}


        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-purple-100 text-gray-700 w-full ${!isOpen ? 'justify-center' : ''}`}
        >
          <LogOut size={25} />
          {isOpen && <span>Logout</span>}
        </button>
      </nav>
    </div>
  )
}

export default Sidebar
