import {User} from "../models/user.model.js"; // Fix this import - remove curly braces
import AsyncHandler from "express-async-handler";
import { searchJobs, calculateSkillMatch } from '../utils/JobService.js';

// Get job recommendations based on user skills
export const getJobRecommendations = AsyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const location = req.query.location || '';
    const page = parseInt(req.query.page) || 1;
    
    // Get user with parsed resume data
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Check if parsedResumeData exists and has skills
    if (!user.parsedResumeData || !user.parsedResumeData.skills || !user.parsedResumeData.skills.length) {
      return res.status(400).json({
        success: false,
        message: "No skills found in your resume to match jobs"
      });
    }
    
    const userSkills = user.parsedResumeData.skills;
    console.log(`Found ${userSkills.length} skills:`, userSkills);
    
    // Fetch jobs from RapidAPI
    const jobsData = await searchJobs(userSkills, location, page);
    console.log("Raw job data received:", JSON.stringify(jobsData.results.length));
    
    // Debug - check the structure of the first job
    if (jobsData.results && jobsData.results.length > 0) {
      console.log("Sample job data structure:", Object.keys(jobsData.results[0]));
    }
    
    // Process job results and calculate match scores
    const processedJobs = jobsData.results.map(job => {
      // Check if job description exists
      if (!job.job_description) {
        console.warn("Job missing description:", job.job_id || job.id);
      }
      
      const { percentage: matchPercentage, matchedSkills } = calculateSkillMatch(
        job.job_description || '', // Make sure to handle missing descriptions
        userSkills
      );
      
      // Format for frontend - transform job_* fields to expected names
      return {
        _id: job.job_id || job.id || `mock-${Math.random().toString(36).substring(7)}`,
        title: job.job_title || job.title || 'Job Title Not Available',
        company: job.employer_name || job.company || 'Company Not Specified',
        location: `${job.job_city || ''} ${job.job_state || ''} ${job.job_country || 'India'}`.trim(),
        description: job.job_description || job.description || '',
        salary: {
          min: job.job_min_salary || job.salary_min || null,
          max: job.job_max_salary || job.salary_max || null,
          currency: 'INR'
        },
        type: job.job_employment_type || job.type || 'Full-time',
        datePosted: job.job_posted_at_datetime_utc || job.created || new Date().toISOString(),
        matchPercentage,
        matchingSkills: matchedSkills,
        url: job.job_apply_link || job.redirect_url || null,
        isRemote: job.job_is_remote || false,
        publisher: job.job_publisher || 'Not Specified'
      };
    });
    
    console.log(`Processed ${processedJobs.length} jobs`);
    
    // Sort by match percentage (highest first)
    const sortedJobs = processedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return res.status(200).json({
      success: true,
      count: sortedJobs.length,
      totalResults: jobsData.count,
      totalPages: Math.ceil(jobsData.count / jobsData.results_per_page) || 1,
      currentPage: page,
      recommendations: sortedJobs
    });
      
  } catch (error) {
    console.error("Error in job recommendations:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating job recommendations",
      error: error.message
    });
  }
});