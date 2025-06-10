import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Save, UserCircle, Bell, Briefcase, Brain, Lock, FileText , Check } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Toaster } from 'react-hot-toast';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        defaultLocation: '',
        minSalary: '',
        maxSalary: '',
        preferredJobTypes: [],
        emailNotifications: true,
        jobAlerts: true,
        weeklyDigest: false
    });
    const [manualSkills, setManualSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [profileUpdateStatus, setProfileUpdateStatus] = useState(null); // 'success', 'error', or null
    const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null);
    const [preferencesUpdateStatus, setPreferencesUpdateStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);


    useEffect(() => {
        // Reset all status indicators when changing tabs
        setProfileUpdateStatus(null);
        setPasswordUpdateStatus(null);
        setPreferencesUpdateStatus(null);
    }, [activeTab]);


    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setUserData(response.data);
                setFormData({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    defaultLocation: response.data.preferences?.defaultLocation || '',
                    minSalary: response.data.preferences?.salary?.min || '',
                    maxSalary: response.data.preferences?.salary?.max || '',
                    preferredJobTypes: response.data.preferences?.jobTypes || [],
                    emailNotifications: response.data.preferences?.notifications?.email || true,
                    jobAlerts: response.data.preferences?.notifications?.jobAlerts || true,
                    weeklyDigest: response.data.preferences?.notifications?.weeklyDigest || false
                });

                // Set manual skills if they exist
                if (response.data.manualSkills) {
                    setManualSkills(response.data.manualSkills);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load your settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleJobTypeToggle = (jobType) => {
        setFormData(prev => {
            const updatedJobTypes = [...prev.preferredJobTypes];

            if (updatedJobTypes.includes(jobType)) {
                return {
                    ...prev,
                    preferredJobTypes: updatedJobTypes.filter(type => type !== jobType)
                };
            } else {
                return {
                    ...prev,
                    preferredJobTypes: [...updatedJobTypes, jobType]
                };
            }
        });
    };

    const handleAddSkill = () => {
        if (newSkill && !manualSkills.includes(newSkill)) {
            setManualSkills([...manualSkills, newSkill]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setManualSkills(manualSkills.filter(s => s !== skill));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            console.log('Sending profile update:', {
                name: formData.name,
                email: formData.email
            });

            const response = await axios.put('/api/v1/users/profile', {
                name: formData.name,
                email: formData.email
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Profile update response:', response.data);

            if (response.data.success) {
                setProfileUpdateStatus('success');
                toast.success('Profile updated successfully');
                // Refresh user data to show the changes
                fetchUserData();
            } else {
                setProfileUpdateStatus('error');
                toast.error(response.data.message || 'Update failed');
            }
        } catch (error) {
            setProfileUpdateStatus('error');
            console.error('Error updating profile:', error);

            if (error.response) {
                
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                toast.error(error.response.data?.message || 'Failed to update profile');
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please check your connection.');
            } else {
                // Something happened in setting up the request
                toast.error('Error updating profile: ' + error.message);
            }
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordUpdateStatus(null);

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.put('/api/v1/users/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setPasswordUpdateStatus('success');
                toast.success('Password updated successfully');
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            setPasswordUpdateStatus('error');
            console.error('Error updating password:', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        }
    };

    const handlePreferencesUpdate = async (e) => {
        e.preventDefault();
        setPreferencesUpdateStatus(null);
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.put('/api/v1/users/preferences', {
                defaultLocation: formData.defaultLocation,
                salary: {
                    min: formData.minSalary,
                    max: formData.maxSalary
                },
                jobTypes: formData.preferredJobTypes,
                notifications: {
                    email: formData.emailNotifications,
                    jobAlerts: formData.jobAlerts,
                    weeklyDigest: formData.weeklyDigest
                },
                manualSkills: manualSkills
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setPreferencesUpdateStatus('success');
                toast.success('Preferences updated successfully');
            }
        } catch (error) {
            setPreferencesUpdateStatus('error');
            console.error('Error updating preferences:', error);
            toast.error('Failed to update preferences');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.delete('/api/v1/users/account', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                localStorage.removeItem('token');
                toast.success('Account deleted successfully');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account');
        }
    };

    // Tab navigation
    const tabs = [
        { id: 'profile', label: 'Profile', icon: <UserCircle size={20} /> },
        { id: 'security', label: 'Security', icon: <Lock size={20} /> },
        { id: 'jobPreferences', label: 'Job Preferences', icon: <Briefcase size={20} /> },
        { id: 'skills', label: 'Skills', icon: <Brain size={20} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
        { id: 'resume', label: 'Resume', icon: <FileText size={20} /> }
    ];

    return (
        <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 p-5" id="main-content">
                <h1 className="text-2xl font-semibold mb-6" style={{ color: '#560edd' }}>
                    Settings
                </h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : (
                            <>
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <form onSubmit={handleProfileUpdate}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="Your full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="Your email address"
                                                />
                                            </div>
                                            {profileUpdateStatus === 'success' && (
                                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md">
                                                    Profile updated successfully!
                                                </div>
                                            )}
                                            {profileUpdateStatus === 'error' && (
                                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md">
                                                    Failed to update profile. Please try again.
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={profileUpdateStatus === 'success'}
                                                className={`px-4 py-2 ${profileUpdateStatus === 'success'
                                                    ? 'bg-green-600'
                                                    : 'bg-purple-600 hover:bg-purple-700'
                                                    } text-white rounded-md flex items-center`}
                                            >
                                                {profileUpdateStatus === 'success' ? (
                                                    <>
                                                        <Check size={16} className="mr-2" />
                                                        Saved
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={16} className="mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Security Tab */}
                                {activeTab === 'security' && (
                                    <div>
                                        <form onSubmit={handlePasswordUpdate} className="mb-8">
                                            <h3 className="text-lg font-medium mb-4">Change Password</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Current Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={formData.currentPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={formData.newPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                    />
                                                </div>
                                                {passwordUpdateStatus === 'success' && (
                                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md">
                                                        Password updated successfully!
                                                    </div>
                                                )}
                                                {passwordUpdateStatus === 'error' && (
                                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md">
                                                        Failed to update password. Please try again.
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={passwordUpdateStatus === 'success'}
                                                    className={`px-4 py-2 ${passwordUpdateStatus === 'success'
                                                        ? 'bg-green-600'
                                                        : 'bg-purple-600 hover:bg-purple-700'
                                                        } text-white rounded-md flex items-center`}
                                                >
                                                    {passwordUpdateStatus === 'success' ? (
                                                        <>
                                                            <Check size={16} className="mr-2" />
                                                            Saved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save size={16} className="mr-2" />
                                                            Update Password
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>

                                        <div className="border-t pt-6">
                                            <h3 className="text-lg font-medium mb-4">Delete Account</h3>
                                            <p className="text-gray-600 mb-4">
                                                This will permanently delete your account and all associated data.
                                                This action cannot be undone.
                                            </p>
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Job Preferences Tab */}
                                {activeTab === 'jobPreferences' && (
                                    <form onSubmit={handlePreferencesUpdate}>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Default Location
                                                </label>
                                                <input
                                                    type="text"
                                                    name="defaultLocation"
                                                    value={formData.defaultLocation}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="e.g. Bangalore, Mumbai, Delhi"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Salary Range (₹ per year)
                                                </label>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                                                        <input
                                                            type="number"
                                                            name="minSalary"
                                                            value={formData.minSalary}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                            placeholder="Min"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                                                        <input
                                                            type="number"
                                                            name="maxSalary"
                                                            value={formData.maxSalary}
                                                            onChange={handleInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                            placeholder="Max"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Preferred Job Types
                                                </label>
                                                <div className="flex flex-wrap gap-3">
                                                    {['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'].map((type) => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => handleJobTypeToggle(type)}
                                                            className={`px-4 py-2 rounded-full text-sm ${formData.preferredJobTypes.includes(type)
                                                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                                }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {preferencesUpdateStatus === 'success' && (
                                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md">
                                                    Preferences updated successfully!
                                                </div>
                                            )}
                                            {preferencesUpdateStatus === 'error' && (
                                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md">
                                                    Failed to update preferences. Please try again.
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={preferencesUpdateStatus === 'success'}
                                                className={`px-4 py-2 ${preferencesUpdateStatus === 'success'
                                                    ? 'bg-green-600'
                                                    : 'bg-purple-600 hover:bg-purple-700'
                                                    } text-white rounded-md flex items-center`}
                                            >
                                                {preferencesUpdateStatus === 'success' ? (
                                                    <>
                                                        <Check size={16} className="mr-2" />
                                                        Saved
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={16} className="mr-2" />
                                                        Save Preferences
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Skills Tab */}
                                {activeTab === 'skills' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Manually Add Skills</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Add skills that might not have been detected from your resume.
                                            </p>

                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="text"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="Add a skill (e.g. React, Python, Project Management)"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddSkill}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                                >
                                                    Add
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {manualSkills.map((skill) => (
                                                    <div
                                                        key={skill}
                                                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {skill}
                                                        <button
                                                            onClick={() => handleRemoveSkill(skill)}
                                                            className="ml-2 text-purple-500 hover:text-purple-700"
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePreferencesUpdate}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                                        >
                                            <Save size={16} className="mr-2" />
                                            Save Skills
                                        </button>
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === 'notifications' && (
                                    <form onSubmit={handlePreferencesUpdate}>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-2">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                                                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="emailNotifications"
                                                        checked={formData.emailNotifications}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-700">Job Alerts</h3>
                                                    <p className="text-xs text-gray-500">Receive alerts for new matching jobs</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="jobAlerts"
                                                        checked={formData.jobAlerts}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-700">Weekly Digest</h3>
                                                    <p className="text-xs text-gray-500">Receive a weekly summary of jobs and insights</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="weeklyDigest"
                                                        checked={formData.weeklyDigest}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </label>
                                            </div>

                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                                            >
                                                <Save size={16} className="mr-2" />
                                                Save Notification Settings
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Resume Tab */}
                                {activeTab === 'resume' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Resume Management</h3>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Update your resume or manage how your resume is parsed.
                                            </p>

                                            <div className="flex flex-col gap-4">
                                                <button
                                                    onClick={() => navigate('/dashboard/resume')}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center"
                                                >
                                                    <FileText size={16} className="mr-2" />
                                                    View Current Resume
                                                </button>

                                                <button
                                                    onClick={() => navigate('/dashboard/register')}
                                                    className="px-4 py-2 bg-white border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 flex items-center justify-center"
                                                >
                                                    Upload New Resume
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;