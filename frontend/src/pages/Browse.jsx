
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Browse() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-10">
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    Browse Jobs
                </h1>

                <p className="mb-8 text-gray-600">
                    {keyword
                        ? `Explore opportunities related to "${keyword}".`
                        : "Explore opportunities and find your next career move."}
                </p>

                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                    <h2 className="mb-3 text-xl font-semibold">
                        Find Your Next Opportunity
                    </h2>

                    <p className="mb-6 text-gray-600">
                        Browse the available jobs on JobParadise.
                    </p>

                    <Link
                        to="/jobs"
                        className="inline-block rounded-md bg-[#6A38C2] px-6 py-3 font-medium text-white hover:bg-[#5b30a6]"
                    >
                        View All Jobs
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default Browse;
