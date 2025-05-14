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
