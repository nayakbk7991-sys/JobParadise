
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function CompanyDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div>
            <Navbar />

            <main className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="mb-3 text-2xl font-bold">
                    Company Details
                </h1>

                <p className="mb-6 text-gray-600">
                    Company registration is complete. You can continue to
                    browse jobs or return to the home page.
                </p>

                <p className="mb-6 break-all text-sm text-gray-500">
                    Company ID: {id}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/jobs")}
                        className="rounded-md bg-blue-600 px-5 py-2 text-white"
                    >
                        Browse Jobs
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="rounded-md border px-5 py-2"
                    >
                        Home
                    </button>
                </div>
            </main>
        </div>
    );
}
