import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import mongoose from "mongoose";

export const registerCompany = async (req,res) => {
    try{
        const {name}=req.body;
        if(!name){
            return res.status(400).json({
                message:"Company Name is Required",
                success: false,
            })
        }
        let company = await Company.findOne({name});
        if(company){
            return res.status(400).json({
                message:"Company Name Already registered",
                success: false,
            })
        };
        company = await Company.create({
            name,
            userId:req.id,
        });

        return res.status(201).json({
            message:"Company Registered successfully",
            company,
            success: true,
        })
    }catch(error){
        console.log(error);
    }
}

export const getCompany = async (req,res) => {
    try{
        const userId=req.id;  // logged in user's id
        const companies=await Company.find({userId});
        if(!companies){
            return res.status(400).json({
                message:"Comapnies Not Found",
                success:false
            })
        };
        return res.status(200).json({
            message:"Companies Found Successfully",
            companies,
            success: true,
        })
    }catch(error){
        console.log(error);
    }
}

// Now Getting Companies By ID :-
export const getCompanyById = async (req,res) => {
    try {
        const companyId=req.params.id;
        const company = await Company.findOne({ _id: companyId });
        if(!company){
            return res.status(400).json({
                message:"Company Not Found",
                success:false,
            })
        };
        return res.status(200).json({
            company,
            success:true,
        })  
    } catch (error) {
        console.log(error);

    }
}

// To update Companies Information :-
export const updateCompany = async (req,res) => {
    try {
        const {name,description,website,location}=req.body;
        // console.log(name,description,website,location);
        // const file=req.file;
        // // cloudinary 
        // const fileUri = getDataUri(file);
        // console.log(req.file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        // const logo = cloudResponse.secure_url;  

        // const updateData={name,description,website,location,logo};
        const file = req.file;

        const updateData = {
            name,
            description,
            website,
            location,
        };

        if (file) {
        const fileUri = getDataUri(file);

        const cloudResponse = await cloudinary.uploader.upload(
            fileUri.content
        );

        updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(req.params.id,updateData, {new: true});
        if(!company){
            return res.status(404).json({
                message:"Company Not Found",
                success:false,
            })
        };
        return res.status(200).json({
            message:"Company is Updated",
            company,
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
} 