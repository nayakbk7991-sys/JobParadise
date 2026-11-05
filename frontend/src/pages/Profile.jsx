
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import axiosInstance from "../utils/axios.js";
import { setUser } from "../redux/authSlice.js";

function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [resume, setResume] = useState(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const [resumeName, setResumeName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFullname(user.fullname || "");
            setEmail(user.email || "");
            setPhoneNumber(user.phoneNumber?.toString() || "");
            setBio(user.profile?.bio || "");
            setSkills(
                Array.isArray(user.profile?.skills)
                    ? user.profile.skills.join(", ")
                    : ""
            );
            setResumeUrl(user.profile?.resume || "");
            setResumeName(user.profile?.resumeOriginalName || "");
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("fullname", fullname.trim());
        formData.append("email", email.trim());
        formData.append("phoneNumber", phoneNumber);
        formData.append("bio", bio.trim());
        formData.append("skills", skills);

        if (resume) {
            formData.append("file", resume);
        }

        try {
            setLoading(true);

            await axiosInstance.post(
                "/user/profile/update",
                formData
            );

            const response = await axiosInstance.get("/user/me");
            const updatedUser = response.data.user;

            dispatch(setUser(updatedUser));

            setResume(null);
            setResumeUrl(updatedUser.profile?.resume || "");
            setResumeName(
                updatedUser.profile?.resumeOriginalName || ""
            );

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update your profile"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    My Profile
                </h1>

                <p className="mb-8 text-gray-600">
                    Manage your personal information and professional
                    details for job applications.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-xl border bg-white p-6 shadow-sm sm:p-8"
                >
                    <div>
                        <h2 className="mb-5 text-xl font-semibold text-gray-900">
                            Personal Information
                        </h2>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="fullname"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="fullname"
                                    type="text"
                                    value={fullname}
                                    onChange={(event) =>
                                        setFullname(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="phoneNumber"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Phone Number
                                </label>
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(event) =>
                                        setPhoneNumber(event.target.value)
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="bio"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Professional Summary
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            rows={4}
                            placeholder="Briefly describe your background, strengths, and career goals."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="skills"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Skills
                        </label>
                        <input
                            id="skills"
                            type="text"
                            value={skills}
                            onChange={(event) => setSkills(event.target.value)}
                            placeholder="React, JavaScript, HTML, CSS, Node.js"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Separate each skill with a comma.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-xl font-semibold text-gray-900">
                            Resume
                        </h2>

                        {resumeUrl && (
                            <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                <p className="mb-2 text-sm text-gray-600">
                                    Current resume
                                </p>
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="break-all font-medium text-blue-600 hover:underline"
                                >
                                    {resumeName || "View uploaded resume"}
                                </a>
                            </div>
                        )}

                        <label
                            htmlFor="resume"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Upload or Replace Resume
                        </label>
                        <input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(event) =>
                                setResume(event.target.files?.[0] || null)
                            }
                            className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
                        />

                        {resume && (
                            <p className="mt-2 break-all text-sm text-gray-600">
                                Selected file: {resume.name}
                            </p>
                        )}
                        <p className="mt-2 text-sm text-gray-500">
                            Accepted formats: PDF, DOC, and DOCX.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {loading ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Profile;
