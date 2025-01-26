import bcrypt from 'bcrypt';
import {User} from '../models/user.model.js'; 

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
   
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const hashedPassword = bcrypt.hashSync(password, 10);

   
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};