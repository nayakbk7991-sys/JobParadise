
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    MapPin,
    BriefcaseBusiness,
    IndianRupee,
    Clock
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import axios from "../utils/axios.js";
import { JOB_API_END_POINT } from "../utils/constant.js";
import { setAllJobs, setLoading } from "../redux/jobSlice.js";

const demoJobs = [
    {
        _id: "demo-frontend",
        title: "Frontend Developer",
        company: { name: "JobParadise Demo" },
        position: 2,
        jobType: "Full-time",
        location: "Pune, Maharashtra",
        experienceLevel: 0,
        salary: "3–5",
        description: "Build responsive web interfaces using HTML, CSS, JavaScript and React. This is a sample listing for preview purposes."
    },
    {
        _id: "demo-react",
        title: "React Developer",
        company: { name: "Tech Solutions Demo" },
        position: 1,
        jobType: "Full-time",
        location: "Mumbai, Maharashtra",
        experienceLevel: 1,
        salary: "4–7",
        description: "Develop reusable React components, integrate APIs and help improve application performance. This is a sample listing."
    },
    {
        _id: "demo-mern",
        title: "Junior MERN Stack Developer",
        company: { name: "Digital Works Demo" },
        position: 2,
        jobType: "Full-time",
        location: "Remote",
        experienceLevel: 0,
        salary: "3–6",
        description: "Learn and build applications using MongoDB, Express, React and Node.js. This is a sample listing."
    }
];

function Jobs() {
    const dispatch = useDispatch();
    const { allJobs, loading } = useSelector((store) => store.job);
    const [error, setError] = useState("");
    const [showDemoJobs, setShowDemoJobs] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchJobs = async () => {
            dispatch(setLoading(true));
            setError("");
            setShowDemoJobs(false);

            try {
                const response = await axios.get(`${JOB_API_END_POINT}/get`);

                if (!active) return;

                if (response.data.success) {
                    const jobs = response.data.jobs || [];
                    dispatch(setAllJobs(jobs));
                    setShowDemoJobs(jobs.length === 0);
                } else {
                    setError("Unable to load jobs.");
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load jobs. Please try again."
                    );
                }
            } finally {
                if (active) dispatch(setLoading(false));
            }
        };

        fetchJobs();

        return () => {
            active = false;
        };
    }, [dispatch]);

    const displayedJobs = showDemoJobs ? demoJobs : allJobs;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="mb-3 text-3xl font-bold text-gray-900">
                        Explore Jobs
                    </h1>
                    <p className="text-gray-600">
                        Find opportunities that match your skills and career goals.
                    </p>
                </div>

                {loading ? (
                    <p className="py-12 text-center text-gray-600">
                        Loading jobs...
                    </p>
                ) : error ? (
                    <div className="rounded-lg border border-red-200 bg-white p-8 text-center">
                        <p className="mb-4 text-red-600">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-md bg-purple-700 px-5 py-2 text-white hover:bg-purple-800"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {showDemoJobs && (
                            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                Demo mode: these sample jobs are for preview only.
                                They are not saved in your database, and applications
                                to these listings are not real.
                            </div>
                        )}

                        <p className="mb-5 text-sm text-gray-600">
                            {displayedJobs.length} job{displayedJobs.length !== 1 ? "s" : ""} available
                        </p>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {displayedJobs.map((job) => (
                                <article
                                    key={job._id}
                                    className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {job.title}
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {job.company?.name || "Company"}
                                        </p>
                                    </div>

                                    <div className="mb-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                                            {job.position} Position{Number(job.position) !== 1 ? "s" : ""}
                                        </span>
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                                            {job.jobType}
                                        </span>
                                    </div>

                                    <div className="mb-5 space-y-2 text-sm text-gray-600">
                                        <p className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            {job.location}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <BriefcaseBusiness size={16} />
                                            {job.experienceLevel} years experience
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <IndianRupee size={16} />
                                            {job.salary} LPA
                                        </p>
                                        {job.createdAt && (
                                            <p className="flex items-center gap-2">
                                                <Clock size={16} />
                                                Posted {new Date(job.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    <p className="mb-5 flex-grow text-sm leading-6 text-gray-700">
                                        {job.description}
                                    </p>

                                    {job._id.startsWith("demo-") ? (
                                        <span className="mt-auto block rounded-md bg-gray-200 px-4 py-3 text-center text-sm text-gray-600">
                                            Sample listing — details unavailable
                                        </span>
                                    ) : (
                                        <Link
                                            to={`/description/${job._id}`}
                                            className="mt-auto block rounded-md bg-purple-700 px-4 py-3 text-center font-medium text-white transition hover:bg-purple-800"
                                        >
                                            View Details
                                        </Link>
                                    )}
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Jobs;
