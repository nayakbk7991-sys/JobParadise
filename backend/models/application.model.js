
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        applicantDetails: {
            fullname: {
                type: String,
                required: true,
                trim: true
            },
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },
            phoneNumber: {
                type: String,
                required: true,
                trim: true
            },
            qualification: {
                type: String,
                required: true,
                trim: true
            },
            institution: {
                type: String,
                required: true,
                trim: true
            },
            graduationYear: {
                type: Number,
                required: true
            },
            grade: {
                type: String,
                required: true,
                trim: true
            },
            experienceType: {
                type: String,
                enum: ["fresher", "experienced"],
                required: true
            },
            experienceYears: {
                type: String,
                default: ""
            },
            skills: {
                type: [String],
                default: []
            },
            projects: {
                type: String,
                default: ""
            },
            resume: {
                type: String,
                required: true
            },
            resumeOriginalName: {
                type: String,
                required: true
            }
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

applicationSchema.index(
    { job: 1, applicant: 1 },
    { unique: true }
);

export const Application = mongoose.model(
    "Application",
    applicationSchema
);
