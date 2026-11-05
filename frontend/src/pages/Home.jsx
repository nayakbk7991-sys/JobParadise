
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-20">
                <div className="text-center">
                    <p className="mb-4 font-semibold text-purple-700">
                        WELCOME TO JOBPARADISE
                    </p>

                    <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
                        Find Your Dream Job Today
                    </h1>

                    <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
                        Discover job opportunities, connect with employers,
                        and take the next step in your career.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/jobs"
                            className="rounded-md bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800"
                        >
                            Browse Jobs
                        </Link>

                        <Link
                            to="/signup"
                            className="rounded-md border border-purple-700 px-6 py-3 font-semibold text-purple-700 hover:bg-purple-50"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
