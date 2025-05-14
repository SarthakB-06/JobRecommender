import mongoose ,{ Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resumeUrl:{
        type:String,
        default:""
    },
    resumeUploaded:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true}) 


export const User = mongoose.model("User",userSchema)