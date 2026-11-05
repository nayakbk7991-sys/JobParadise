
import { useState } from "react";
import { LogOut, User2, Menu, X, Building2, BriefcaseBusiness } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios.js";
import { clearUser } from "../redux/authSlice.js";

export default function Navbar() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMenus = () => {
        setProfileOpen(false);
        setMobileMenuOpen(false);
    };

    const logoutHandler = async () => {
        try {
            const response = await axiosInstance.get("/user/logout");

            if (response.data.success) {
                dispatch(clearUser());
                closeMenus();
                navigate("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            alert(
                error.response?.data?.message ||
                "Unable to log out. Please try again."
            );
        }
    };

    const displayName = user?.fullname || user?.name || "User";
    const profilePhoto = user?.profile?.profilePhoto;

    return (
        <header className="relative z-50 border-b bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link to="/" onClick={closeMenus} className="text-2xl font-bold">
                    Job<span className="text-[#F83002]">Paradise</span>
                </Link>

                <button
                    type="button"
                    className="rounded-md p-2 md:hidden"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav
                    className={`${mobileMenuOpen ? "flex" : "hidden"} absolute left-0 top-16 w-full flex-col gap-4 border-b bg-white p-4 shadow-md md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:p-0 md:shadow-none`}
                >
                    <div className="flex flex-col gap-4 font-medium md:flex-row md:items-center md:gap-6">
                        <Link to="/" onClick={closeMenus}>Home</Link>
                        <Link to="/jobs" onClick={closeMenus}>Jobs</Link>
                        <Link to="/browse" onClick={closeMenus}>Browse</Link>

                        {user?.role === "recruiter" && (
                            <>
                                <Link
                                    to="/admin/companies/create"
                                    onClick={closeMenus}
                                    className="flex items-center gap-2"
                                >
                                    <Building2 size={18} />
                                    Register Company
                                </Link>

                                <Link
                                    to="/admin/jobs"
                                    onClick={closeMenus}
                                    className="flex items-center gap-2"
                                >
                                    <BriefcaseBusiness size={18} />
                                    Post a Job
                                </Link>
                            </>
                        )}
                    </div>

                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/login" onClick={closeMenus} className="rounded-md border px-4 py-2 text-sm">
                                Login
                            </Link>
                            <Link to="/signup" onClick={closeMenus} className="rounded-md bg-[#6A38C2] px-4 py-2 text-sm text-white">
                                Signup
                            </Link>
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setProfileOpen((open) => !open)}
                                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-gray-100 font-semibold"
                                aria-label="Open profile menu"
                            >
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt={displayName} className="h-full w-full object-cover" />
                                ) : (
                                    displayName.charAt(0).toUpperCase()
                                )}
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-12 w-64 rounded-lg border bg-white p-4 shadow-lg">
                                    <p className="font-semibold">{displayName}</p>
                                    <p className="mb-3 break-words text-sm text-gray-500">
                                        {user.email || user.role}
                                    </p>

                                    {user.role === "student" && (
                                        <Link
                                            to="/profile"
                                            onClick={closeMenus}
                                            className="mb-3 flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-100"
                                        >
                                            <User2 size={18} />
                                            View Profile
                                        </Link>
                                    )}

                                    <button
                                        type="button"
                                        onClick={logoutHandler}
                                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
