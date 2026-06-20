import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req,res) => {
    try{
        const {fullname,email,phoneNumber,password, role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message: "Somthing is missing",
                success:false,
            });
        }
        // const file = req.file;
        // let cloudResponse = null;

        // if (file) {
        //     const fileUri = getDataUri(file);
        //     cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        // }
        const file = req.file;
        let cloudResponse = null;

        if (file) {
            const fileUri = getDataUri(file);

            cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                {
                    resource_type: "auto"
                }
            );
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists",
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse ? cloudResponse.secure_url : "",
            }
        })
        return res.status(201).json({
            message:"Account Created Successfully",
            success: true,
        });
    }catch(error){
        console.log(error);
    }
}

export const login = async (req,res) => {
    try{
        const {email,password,role} = req.body;
        if( !email || !password || !role){
            return res.status(400).json({
                message: "Somthing is missing",
                success:false,
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Incorrect Email or Password",
                success:false
            })
        }
        // Check for password if password is matching or not 
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect Email or Password",
                success:false
            })
        }
        // Check for role is correct or not
        if(role!=user.role){
            return res.status(400).json({
                message:"Account does not exist with current role",
                success:false
            })
        };
        const tokenData = {
            userId:user._id,
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }

        return res.status(200).cookie("token",token, {maxAge:1*24*60*60*1000 , httpsOnly:true , sameSite:'strict'}).json({
            message: `Welcome Back ${user.fullname}`,
            user,
            success:true,
        });
    }catch(error){
        console.log(error);
    }
}

export const logout = async (req,res) => {
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logout Successfully",
            success:true,
        })
    }catch(error){
        console.log(error);
    }
}

export const updateProfile = async (req,res) => {
    try{
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        // console.log(fullname,email,phoneNumber,bio,skills);
        const file = req.file;

        let cloudResponse = null;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(
                fileUri.content,
                {
                    resource_type: "auto"
                }
            );
        }

        
        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId=req.id;  // middleware authentication
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message: "User Not Found",
                success: false,
            })
        }
        // Updating Data
        if(fullname) user.fullname=fullname;
        if(email) user.email=email;
        if(phoneNumber) user.phoneNumber=phoneNumber;
        if(bio) user.profile.bio=bio;
        if(skillsArray) user.profile.skills=skillsArray;

        // resume comes later here ...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url  // save the cloudinary Uri
            user.profile.resumeOriginalName=file.originalname  // Save the original filename
        }

        await user.save();

        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }

        return res.status(201).json({
            message:"Profile Updated Successfully",
            user,
            success: true,
        });

    }catch(error){
        console.log(error);
    }
}