
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../utils/axios.js";
import {
    JOB_API_END_POINT,
    APPLICATION_API_END_POINT
} from "../utils/constant.js";

const initialForm = {
    fullname: "",
    email: "",
    phoneNumber: "",
    qualification: "",
    institution: "",
    graduationYear: "",
    grade: "",
    experienceType: "fresher",
    experienceYears: "",
    skills: "",
    projects: ""
};

const inputClass =
    "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-[#6A38C2] focus:ring-1 focus:ring-[#6A38C2]";

const labelClass = "block text-sm font-medium text-gray-700";

export default function JobDescription() {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [resume, setResume] = useState(null);

    useEffect(() => {
        let active = true;

        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosInstance.get(
                    `${JOB_API_END_POINT}/get/${id}`
                );

                if (!response.data.success) {
                    throw new Error(
                        response.data.message || "Unable to load job details."
                    );
                }

                if (active) {
                    setJob(response.data.job);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Unable to load job details."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchJob();

        return () => {
            active = false;
        };
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const openApplicationForm = () => {
        if (!user) {
            toast.error("Please log in before applying.");
            return;
        }

        if (user.role !== "student") {
            toast.error("Only students can apply for jobs.");
            return;
        }

        if (hasApplied || applying) {
            return;
        }

        setForm({
            ...initialForm,
            fullname: user.fullname || user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || ""
        });

        setShowApplicationForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeApplicationForm = () => {
        if (applying) {
            return;
        }

        setShowApplicationForm(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleResumeChange = (event) => {
        const selectedFile = event.target.files?.[0] || null;

        if (!selectedFile) {
            setResume(null);
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const extension = selectedFile.name
            .split(".")
            .pop()
            .toLowerCase();

       const allowedExtensions = ["pdf", "doc", "docx", "rtf", "txt"];

        if (
            !allowedExtensions.includes(extension) ||
            !allowedTypes.includes(selectedFile.type)
        ) {
            toast.error("Please select a PDF, DOC, or DOCX resume.");
            event.target.value = "";
            setResume(null);
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            toast.error("Resume size must not exceed 2 MB.");
            event.target.value = "";
            setResume(null);
            return;
        }

        setResume(selectedFile);
    };

    const handleApplicationSubmit = async (event) => {
        event.preventDefault();

        if (!user || user.role !== "student") {
            toast.error("Please log in as a student to apply.");
            return;
        }

        if (!resume) {
            toast.error("Please upload your resume.");
            return;
        }

        const graduationYear = Number(form.graduationYear);
        const currentYear = new Date().getFullYear();

        if (
            !Number.isInteger(graduationYear) ||
            graduationYear < 1950 ||
            graduationYear > currentYear + 10
        ) {
            toast.error("Please enter a valid graduation year.");
            return;
        }

        const phoneDigits = form.phoneNumber.replace(/\D/g, "");

        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        if (
            form.experienceType === "experienced" &&
            !form.experienceYears.trim()
        ) {
            toast.error("Please enter your years of experience.");
            return;
        }

        try {
            setApplying(true);

            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            formData.append("file", resume);

            const response = await axiosInstance.post(
                `${APPLICATION_API_END_POINT}/apply/${id}`,
                formData
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Unable to submit your application."
                );
            }

            setHasApplied(true);
            setShowApplicationForm(false);
            setResume(null);

            toast.success(
                response.data.message ||
                "Application submitted successfully!"
            );

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Unable to submit your application. Please try again."
            );
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50 px-4 py-12">
                    <p className="mx-auto max-w-5xl text-gray-600">
                        Loading job details...
                    </p>
                </main>
            </>
        );
    }

    if (error || !job) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50 px-4 py-12">
                    <div className="mx-auto max-w-5xl">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Job Description
                        </h1>
                        <p className="mt-4 text-red-600">
                            {error || "Job not found."}
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-6 inline-block text-[#6A38C2] hover:underline"
                        >
                            ← Back to Jobs
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    const requirements = Array.isArray(job.requirements)
        ? job.requirements
        : typeof job.requirements === "string"
            ? job.requirements
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [];

    const companyName =
        typeof job.company === "object"
            ? job.company?.name
            : job.companyName;

    const formatSalary = (value) => {
        if (value === undefined || value === null || value === "") {
            return "Not specified";
        }

        return `₹${value}`;
    };

    const experience = job.experienceLevel ?? job.experience;

    return (
        <>
            <Navbar />

            {showApplicationForm ? (
                <main className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
                    <div className="mx-auto max-w-4xl">
                        <button
                            type="button"
                            onClick={closeApplicationForm}
                            disabled={applying}
                            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6A38C2] hover:text-[#572da5] disabled:opacity-50"
                        >
                            <span aria-hidden="true">←</span>
                            Back to Job Details
                        </button>

                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="bg-[#6A38C2] px-6 py-7 text-white sm:px-10">
                                <p className="text-sm font-medium text-purple-100">
                                    JOB APPLICATION
                                </p>

                                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                                    Apply for {job.title || "this position"}
                                </h1>

                                <p className="mt-2 text-sm text-purple-100">
                                    {companyName || "Company"} ·{" "}
                                    {job.location || "Location not specified"}
                                </p>

                                <p className="mt-4 max-w-2xl text-sm leading-6 text-purple-100">
                                    Complete the information below to submit your
                                    application. Fields marked with * are required.
                                </p>
                            </div>

                           <form
    onSubmit={handleApplicationSubmit}
    onInvalidCapture={(event) => {
        toast.error(
            event.target.validationMessage ||
            "Please complete all required fields."
        );
    }}
    className="space-y-9 p-6 sm:p-10"
>
                                <section>
                                    <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                                        01. Personal Information
                                    </h2>

                                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <label className={labelClass}>
                                            Full Name *
                                            <input
                                                name="fullname"
                                                value={form.fullname}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                required
                                                maxLength={100}
                                                autoComplete="name"
                                                placeholder="Enter your full name"
                                            />
                                        </label>

                                        <label className={labelClass}>
                                            Email Address *
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                required
                                                maxLength={254}
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                            />
                                        </label>

                                        <label className={labelClass}>
                                            Phone Number *
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={form.phoneNumber}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                required
                                                maxLength={20}
                                                autoComplete="tel"
                                                placeholder="Enter contact number"
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                                        02. Academic Information
                                    </h2>

                                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <label className={labelClass}>
                                            Highest Qualification *
                                            <select
                                                name="qualification"
                                                value={form.qualification}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                required
                                            >
                                                <option value="">
                                                    Select qualification
                                                </option>
                                                <option value="10th">10th</option>
                                                <option value="12th">12th</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="Bachelor's Degree">
                                                    Bachelor's Degree
                                                </option>
                                                <option value="Master's Degree">
                                                    Master's Degree
                                                </option>
                                                <option value="PhD">PhD</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </label>

                                        <label className={labelClass}>
                                            Institution / College *
                                            <input
                                                name="institution"
                                                value={form.institution}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                required
                                                maxLength={200}
                                                placeholder="Enter institution name"
                                            />
                                        </label>

                                        <label className={labelClass}>
                                            Graduation Year *
                                            <input
                                                type="number"
                                                name="graduationYear"
                                                value={form.graduationYear}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                min="1950"
                                                max={new Date().getFullYear() + 10}
                                                required
                                                placeholder="e.g. 2024"
                                            />
                                        </label>

                                        <label className={labelClass}>
                                            Grade / CGPA / Percentage *
                                            <input
                                                name="grade"
                                                value={form.grade}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                required
                                                maxLength={50}
                                                placeholder="e.g. 8.2 CGPA or 75%"
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                                        03. Professional Information
                                    </h2>

                                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <label className={labelClass}>
                                            Experience Type *
                                            <select
                                                name="experienceType"
                                                value={form.experienceType}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                required
                                            >
                                                <option value="fresher">
                                                    Fresher
                                                </option>
                                                <option value="experienced">
                                                    Experienced
                                                </option>
                                            </select>
                                        </label>

                                        {form.experienceType === "experienced" && (
                                            <label className={labelClass}>
                                                Years of Experience *
                                                <input
                                                    name="experienceYears"
                                                    value={form.experienceYears}
                                                    onChange={handleInputChange}
                                                    className={inputClass}
                                                    required
                                                    maxLength={30}
                                                    placeholder="e.g. 2 years"
                                                />
                                            </label>
                                        )}

                                        <label className={`${labelClass} sm:col-span-2`}>
                                            Skills
                                            <input
                                                name="skills"
                                                value={form.skills}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                maxLength={1000}
                                                placeholder="React, JavaScript, Node.js"
                                            />
                                            <span className="mt-1 block font-normal text-gray-500">
                                                Separate skills with commas.
                                            </span>
                                        </label>

                                        <label className={`${labelClass} sm:col-span-2`}>
                                            Projects / Relevant Work
                                            <textarea
                                                name="projects"
                                                value={form.projects}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                rows={4}
                                                maxLength={3000}
                                                placeholder="Describe your relevant projects or work experience."
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                                        04. Resume
                                    </h2>

                                    <label className={`${labelClass} mt-5`}>
                                        Upload Resume * (PDF, DOC, or DOCX; maximum 2 MB)

                                        <input
                                            type="file"
                                            onChange={handleResumeChange}
                                            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:font-medium file:text-[#6A38C2] hover:file:bg-purple-200"
                                            required
                                        />
                                    </label>

                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        You can browse your computer folders. Only
                                        PDF, DOC, and DOCX files up to 2 MB can be
                                        submitted as a resume.
                                    </p>

                                    {resume && (
                                        <p className="mt-3 break-all text-sm text-gray-600">
                                            Selected file: {resume.name}
                                        </p>
                                    )}
                                </section>

                                <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
                                    <button
                                        type="submit"
                                        disabled={applying}
                                        className="rounded-lg bg-[#6A38C2] px-7 py-3 font-semibold text-white transition hover:bg-[#572da5] disabled:cursor-not-allowed disabled:bg-gray-400"
                                    >
                                        {applying
                                            ? "Submitting Application..."
                                            : "Submit Application"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeApplicationForm}
                                        disabled={applying}
                                        className="rounded-lg border border-gray-300 px-7 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <p className="text-xs leading-5 text-gray-500">
                                    Your details will be submitted with this job
                                    application.
                                </p>
                            </form>
                        </section>
                    </div>
                </main>
            ) : (
                <main className="min-h-screen bg-gray-50 px-4 py-8">
                    <div className="mx-auto max-w-5xl">
                        <Link
                            to="/jobs"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            ← Back to Jobs
                        </Link>

                        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {job.title || "Untitled Job"}
                                    </h1>

                                    {companyName && (
                                        <p className="mt-2 text-gray-600">
                                            {companyName}
                                        </p>
                                    )}
                                </div>

                                <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                                    {job.jobType || "Job"}
                                </span>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Location
                                    </p>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {job.location || "Not specified"}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Salary
                                    </p>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {formatSalary(job.salary)}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Experience
                                    </p>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {experience !== undefined &&
                                        experience !== null &&
                                        experience !== ""
                                            ? typeof experience === "number"
                                                ? `${experience} years`
                                                : experience
                                            : "Not specified"}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">
                                        Openings
                                    </p>
                                    <p className="mt-1 font-semibold text-gray-900">
                                        {job.position ?? "Not specified"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Job Description
                                </h2>
                                <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">
                                    {job.description || "No description provided."}
                                </p>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Requirements
                                </h2>

                                {requirements.length > 0 ? (
                                    <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                                        {requirements.map((requirement, index) => (
                                            <li key={`${index}-${requirement}`}>
                                                {requirement}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-3 text-gray-600">
                                        No specific requirements listed.
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
                                {user?.role === "student" && (
                                    <button
                                        type="button"
                                        onClick={openApplicationForm}
                                        disabled={applying || hasApplied}
                                        className={`rounded-md px-6 py-3 font-semibold text-white transition ${
                                            applying || hasApplied
                                                ? "cursor-not-allowed bg-gray-400"
                                                : "bg-[#6A38C2] hover:bg-[#572da5]"
                                        }`}
                                    >
                                        {hasApplied
                                            ? "Application Submitted"
                                            : "Apply Now"}
                                    </button>
                                )}

                                {!user && (
                                    <>
                                        <p className="text-gray-600">
                                            Log in as a student to apply for this job.
                                        </p>
                                        <Link
                                            to="/login"
                                            className="rounded-md bg-[#6A38C2] px-5 py-2 font-medium text-white hover:bg-[#572da5]"
                                        >
                                            Login to Apply
                                        </Link>
                                    </>
                                )}

                                {user && user.role !== "student" && (
                                    <p className="text-sm text-gray-500">
                                        Recruiter accounts cannot apply for jobs.
                                    </p>
                                )}

                                <Link
                                    to="/jobs"
                                    className="rounded-md border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Browse Jobs
                                </Link>
                            </div>
                        </section>
                    </div>
                </main>
            )}
        </>
    );
}
