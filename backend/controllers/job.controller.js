import { Job } from "../models/job.model.js";

// This is for admin when he has to post a job he can run this function.
export const postJob = async(req,res) => {
    try {
        // console.log(req.body);
        const {title,description,requirements,salary,experienceLevel,location,jobType,position,companyId}=req.body;
        const userId=req.id;

        if(!title || !description || !requirements || !salary || !experienceLevel || !location || !jobType || !position || !companyId){
            return res.status(400).json({
                message:"Something went wrong",
                success:false,
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            experienceLevel,
            location,
            jobType,
            position,
            company:companyId,
            created_by: userId,
        });
        return res.status(201).json({
            message:"Job Posted Successfully",
            job,
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

// When students searches for the job this function will run by filtering out the conditons.
export const getAllJobs = async (req,res) => {
    try {
        const keyword=req.query.keyword || "";
        const query={
            $or: [
                {title: {$regex:keyword, $options:"i"}},
                {description: {$regex:keyword, $options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({createdAt: -1 });
        if(!jobs){
            return res.status(400).json({
                message:"Jobs Not Found",
                success:false,
            })
        }
        return res.status(200).json({
            jobs,
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}
// Getting Jobs By Id  this is for students
export const getJobById = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job=await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
            return res.status(400).json({
                message:"Jobs Not Found",
                success:false,
            })
        }
        return res.status(200).json({
            message:"Job Found for this id",
            job,
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}
// admin has posted how many jobs based on that this function will run:-
export const getAdminJobs = async (req,res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId}).populate({
            path:"company",
            createdAt:-1,
        });
        if(!jobs){
            return res.status(400).json({
                message:"Jobs Not Found",
                success:false,
            })
        };
        return res.status(200).json({
            message:"Job Founded Successfully",
            jobs,
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}