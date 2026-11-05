
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

export default function CompanyCreate() {
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const registerNewCompany = async (event) => {
        event.preventDefault();

        if (!companyName.trim()) {
            toast.error("Please enter a company name.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName: companyName.trim() },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Company registered successfully.");

                const companyId = response.data.company?._id;

                if (companyId) {
                    navigate(`/admin/companies/${companyId}`);
                } else {
                    navigate("/jobs");
                }
            } else {
                toast.error(response.data.message || "Registration failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Registration failed. Please log in and check the backend terminal."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <main className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="mb-2 text-2xl font-bold">Register Your Company</h1>
                <p className="mb-6 text-gray-600">
                    Enter a company name to continue.
                </p>

                <form onSubmit={registerNewCompany}>
                    <label htmlFor="companyName" className="mb-2 block">
                        Company Name
                    </label>

                    <input
                        id="companyName"
                        type="text"
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        placeholder="JobParadise Technologies"
                        required
                        className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3"
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/jobs")}
                            className="rounded-md border px-5 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                        >
                            {loading ? "Registering..." : "Continue"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
