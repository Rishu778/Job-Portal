import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJobs = async (req,res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job Id is required",
                success: false,
            })
        };
        // Check If user has already applied for the job or not :-
        const existingApplication = await Application.findOne({job:jobId, applicant: userId});
        if(existingApplication){
            return res.status(400).json({
                message: "Already applied for this job",
                success: false,
            })
        };

        // Check if the job is existing or not :-
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job Not Found",
                success: false,
            })
        }

        // Creating a New application i.e Now User will be applied :-
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        })
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Job Applied Successfuly",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
};

// To get the count of applied jobs :-
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } }
                }
            });

        if (!application || application.length === 0) {
            return res.status(200).json({
                application: [],
                success: true,
            });
        }

        return res.status(200).json({
            application,
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
        });
    }
};


// Admin will check how many users have applied till now
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: {sort:{createdAt:-1}},
            populate:{
                path: "applicant"
            }
        });
        if(!job){
            return res.status(400).json({
                message: "Job Not Found",
                success: false,
            })
        };

        return res.status(200).json({
            job,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message: "Status Not Found",
                success: true
            })
        };

        // Find the Application By Application id 
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(400).json({
                message: "Application Not Found",
                success: false,
            })
        };
        // Update the status :-
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status Updated Successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}