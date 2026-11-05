
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import Navbar from "../components/Navbar.jsx";
import {
    JOB_API_END_POINT,
    COMPANY_API_END_POINT
} from "../utils/constant.js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function PostJob() {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-time",
        experience: "",
        position: "",
        companyId: ""
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(
                    `${COMPANY_API_END_POINT}/get`,
                    { withCredentials: true }
                );

                if (response.data.success) {
                    const companyList = response.data.companies || [];

                    setCompanies(companyList);

                    if (companyList.length > 0) {
                        setForm((previous) => ({
                            ...previous,
                            companyId: companyList[0]._id
                        }));
                    }
                } else {
                    toast.error(
                        response.data.message || "Unable to load companies."
                    );
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load companies. Please sign in and register your company."
                );
            } finally {
                setLoadingCompanies(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.companyId) {
            toast.error("Please select a registered company.");
            return;
        }

        if (
            !form.title.trim() ||
            !form.description.trim() ||
            !form.requirements.trim() ||
            !form.location.trim()
        ) {
            toast.error("Please complete all required fields.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                ...form,
                title: form.title.trim(),
                description: form.description.trim(),
                requirements: form.requirements.trim(),
                location: form.location.trim(),
                salary: Number(form.salary),
                experience: Number(form.experience),
                position: Number(form.position)
            };

            const response = await axios.post(
                `${JOB_API_END_POINT}/post`,
                payload,
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success(
                    response.data.message || "Job posted successfully!"
                );

                navigate("/jobs");
            } else {
                toast.error(
                    response.data.message || "Unable to post the job."
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Job posting failed. Check your login and required fields."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Post a Job
                </h1>

                <p className="mb-8 text-gray-600">
                    Share your job opening with candidates on JobParadise.
                </p>

                {loadingCompanies ? (
                    <div className="flex items-center gap-2 rounded-lg border bg-white p-6">
                        <Loader2 className="animate-spin" size={20} />
                        Loading your companies...
                    </div>
                ) : companies.length === 0 ? (
                    <div className="rounded-lg border bg-white p-6">
                        <h2 className="mb-2 text-xl font-semibold">
                            Register a company first
                        </h2>

                        <p className="mb-5 text-gray-600">
                            You need a registered company before publishing a job.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/companies/create")}
                            className="rounded-md bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                        >
                            Register Company
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-lg border bg-white p-6 shadow-sm"
                    >
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block font-medium"
                            >
                                Job Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Frontend Developer"
                                required
                                className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block font-medium"
                            >
                                Job Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the role and responsibilities"
                                rows={4}
                                required
                                className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="requirements"
                                className="mb-2 block font-medium"
                            >
                                Requirements
                            </label>

                            <textarea
                                id="requirements"
                                name="requirements"
                                value={form.requirements}
                                onChange={handleChange}
                                placeholder="React, JavaScript, HTML, CSS"
                                rows={3}
                                required
                                className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="salary"
                                    className="mb-2 block font-medium"
                                >
                                    Salary (LPA)
                                </label>

                                <input
                                    id="salary"
                                    name="salary"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={form.salary}
                                    onChange={handleChange}
                                    placeholder="5"
                                    required
                                    className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block font-medium"
                                >
                                    Job Location
                                </label>

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Pune"
                                    required
                                    className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="jobType"
                                    className="mb-2 block font-medium"
                                >
                                    Job Type
                                </label>

                                <select
                                    id="jobType"
                                    name="jobType"
                                    value={form.jobType}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="experience"
                                    className="mb-2 block font-medium"
                                >
                                    Experience (years)
                                </label>

                                <input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    min="0"
                                    value={form.experience}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                    className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="position"
                                    className="mb-2 block font-medium"
                                >
                                    Number of Positions
                                </label>

                                <input
                                    id="position"
                                    name="position"
                                    type="number"
                                    min="1"
                                    value={form.position}
                                    onChange={handleChange}
                                    placeholder="2"
                                    required
                                    className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="companyId"
                                    className="mb-2 block font-medium"
                                >
                                    Company
                                </label>

                                <select
                                    id="companyId"
                                    name="companyId"
                                    value={form.companyId}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-gray-300 p-3 outline-none focus:border-blue-500"
                                >
                                    {companies.map((company) => (
                                        <option
                                            key={company._id}
                                            value={company._id}
                                        >
                                            {company.name || company.companyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/jobs")}
                                className="rounded-md border border-gray-300 px-5 py-3 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Publishing..." : "Publish Job"}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}
