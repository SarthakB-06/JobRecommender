import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardafterLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 👈 added

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      navigate('/login');
    } else if (!userData.resumeUploaded) {
      navigate('/dashboard/register');
    } else {
      setLoading(false); // Only show dashboard when data is valid
    }
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>; // Or a spinner
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard after login</p>
    </div>
  );
};

export default DashboardafterLogin;
