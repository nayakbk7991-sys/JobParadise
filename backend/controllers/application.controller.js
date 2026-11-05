import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

import cloudinary from "../utils/cloudinary.js";



export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        const file = req.file;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        const {
            fullname,
            email,
            phoneNumber,
            qualification,
            institution,
            graduationYear,
            grade,
            experienceType,
            experienceYears,
            skills,
            projects
        } = req.body;

        const requiredFields = {
            fullname,
            email,
            phoneNumber,
            qualification,
            institution,
            graduationYear,
            grade,
            experienceType
        };

        const missingField = Object.entries(requiredFields).some(
            ([, value]) => value === undefined || String(value).trim() === ""
        );

        if (missingField) {
            return res.status(400).json({
                message: "Please complete all required application fields.",
                success: false
            });
        }

        if (!file) {
            return res.status(400).json({
                message: "Please upload your resume.",
                success: false
            });
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                message: "Resume must be a PDF, DOC, or DOCX file.",
                success: false
            });
        }

        if (file.size > 2 * 1024 * 1024) {
            return res.status(400).json({
                message: "Resume size must not exceed 2 MB.",
                success: false
            });
        }

        if (!["fresher", "experienced"].includes(experienceType)) {
            return res.status(400).json({
                message: "Select a valid experience type.",
                success: false
            });
        }

        const resumeUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "jobparadise/resumes",
                    public_id: `${userId}-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(file.buffer);
        });

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            applicantDetails: {
                fullname: fullname.trim(),
                email: email.trim().toLowerCase(),
                phoneNumber: phoneNumber.trim(),
                qualification: qualification.trim(),
                institution: institution.trim(),
                graduationYear: Number(graduationYear),
                grade: grade.trim(),
                experienceType,
                experienceYears: experienceYears || "",
                skills: Array.isArray(skills)
                    ? skills
                    : String(skills || "")
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),
                projects: projects || "",
                resume: resumeUpload.secure_url,
                resumeOriginalName: file.originalname
            }
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job application submitted successfully.",
            success: true
        });
    } catch (error) {
        console.error("Apply job error:", error);

        return res.status(500).json({
            message: "Unable to submit your application. Please try again.",
            success: false
        });
    }
};

export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}