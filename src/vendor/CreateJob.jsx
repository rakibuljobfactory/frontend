import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";

export const CreateJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form states mapped exactly to your backend schema model specifications
    const [formData, setFormData] = useState({
        title: "",
        companyName: "",
        location: "",
        salaryRange: "",
        jobType: "Full-time", // Valid dynamic default state
        contact: "",
        description: "",
    });

    // Enforce instant routing guard if auth assets are completely missing
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            toast.error("Session expired. Please log in again.");
            navigate("/login");
            return;
        }

        // Optional: Auto-populate company name if it's cached in the logged-in user object
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.companyName) {
            setFormData((prev) => ({ ...prev, companyName: parsedUser.companyName }));
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Execute POST routing pipelines targeting your exact path architecture
            const { data } = await axios.post(
                "http://localhost:5000/api/job/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Verified protect middleware handshake payload
                    },
                }
            );

            if (data.success) {
                toast.success(data.message || "Job position published successfully!");
                navigate("/vendor-dashboard"); // Redirect target path anchor
            }
        } catch (error) {
            console.error("Job Creation Error:", error);
            toast.error(
                error.response?.data?.message || "Failed to create the job position."
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">

                    {/* Form Header */}
                    <div className="border-b border-slate-100 pb-6 mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Post a New Job Opening</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Fill out the information matrices below to publish live slots out to job seekers.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1: Title & Company Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Full Stack MERN Developer"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    required
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Glorious Lab"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition"
                                />
                            </div>
                        </div>

                        {/* Row 2: Location & Job Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Geographic Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Guwahati, Assam (or Remote)"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Employment Architecture *
                                </label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-sm outline-none focus:border-blue-600 transition"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 3: Salary Range & Contact Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Salary Compensation Scale *
                                </label>
                                <input
                                    type="text"
                                    name="salaryRange"
                                    required
                                    value={formData.salaryRange}
                                    onChange={handleChange}
                                    placeholder="e.g. ₹6 LPA - ₹10 LPA"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Contact Channels / HR Email *
                                </label>
                                <input
                                    type="email"
                                    name="contact"
                                    required
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="e.g. hr@gloriouslab.com"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition"
                                />
                            </div>
                        </div>

                        {/* Full Width: Job Description TextArea */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Detailed Job Parameters & Requirements *
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Provide a comprehensive operational blueprint regarding everyday task expectations, required technical stacks, and expected experience levels..."
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-600 transition resize-y"
                            ></textarea>
                        </div>

                        {/* Interactive Action Control Interface Blocks */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition shadow-sm disabled:opacity-50"
                            >
                                {loading ? "Publishing Stream..." : "Deploy Listing"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};