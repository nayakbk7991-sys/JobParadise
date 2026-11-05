
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./utils/axios.js";
import {
    setUser,
    clearUser,
    setAuthChecked
} from "./redux/authSlice.js";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Jobs from "./pages/Jobs.jsx";
import Browse from "./pages/Browse.jsx";
import JobDescription from "./pages/JobDescription.jsx";
import Profile from "./pages/Profile.jsx";
import CompanyCreate from "./pages/CompanyCreate.jsx";
import CompanyDetails from "./pages/CompanyDetails.jsx";
import PostJob from "./pages/PostJob.jsx";

function AuthInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        let active = true;

        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get("/user/me");

                if (active && response.data.success) {
                    dispatch(setUser(response.data.user));
                } else if (active) {
                    dispatch(clearUser());
                }
            } catch {
                if (active) {
                    dispatch(clearUser());
                }
            } finally {
                if (active) {
                    dispatch(setAuthChecked(true));
                }
            }
        };

        checkAuth();

        return () => {
            active = false;
        };
    }, [dispatch]);

    return null;
}

function ProtectedRoute({ children }) {
    const { user, authChecked } = useSelector((state) => state.auth);

    if (!authChecked) {
        return <div className="flex min-h-screen items-center justify-center">Checking authentication...</div>;
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthInitializer />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/description/:id" element={<JobDescription />} />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/companies/create"
                    element={
                        <ProtectedRoute>
                            <CompanyCreate />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/companies/:id"
                    element={
                        <ProtectedRoute>
                            <CompanyDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/jobs"
                    element={
                        <ProtectedRoute>
                            <PostJob />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
