import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import AsyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js';

const upload = multer({ storage });

export const uploadResumeToCloudinary = [
  upload.single('resume'),
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.resumeUploaded = true;
    user.resumeUrl = req.file.path; 
    await user.save();

    res.status(200).json({ message: 'Resume uploaded to Cloudinary', url: req.file.path });
  }),
];


export const saveParsedResumeData = AsyncHandler(async (req,res) => {
  try {
    const userId = req.user.id;
    const { parsedData } = req.body;

    if (!parsedData) {
      return res.status(400).json({success: false ,  message: 'Parsed data is required' });
    }


    const updatedUser = await User.findByIdAndUpdate(
      userId ,
      {
        parsedResumeData: parsedData,
        resumeParsedAt: new Date(),
      },
      { new: true }
      
    );

    if(!updatedUser){
      return res.status(404).json({success: false , message: 'User not found' });
    }


    return res.status(200).json({
      success:true,
      message: 'Resume data saved successfully'
    })
  } catch (error) {
    console.error('Error saving parsed resume data:', error);
    return res.status(500).json({success: false , message: 'Internal server error'  , error:error.message});
  }
})
