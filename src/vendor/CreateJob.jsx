import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Layers, 
  IndianRupee, 
  Mail, 
  FileText, 
  PlusCircle, 
  ArrowLeft,
  Loader2
} from "lucide-react";

export const CreateJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form states mapped exactly to your backend schema model specifications
    const [formData, setFormData] = useState({
        title: "",
        companyName: "",
        location: "",
        salaryRange: "",
        jobType: "Full-time",
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

        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser?.companyName) {
                setFormData((prev) => ({ ...prev, companyName: parsedUser.companyName }));
            }
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
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

            const { data } = await axios.post(
                "http://localhost:5000/api/job/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message || "Job position published successfully!");
                navigate("/vendor-dashboard");
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
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                {/* Form Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 p-6 sm:p-8">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                                <PlusCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                                    Post a New Job Opening
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                    Fill in the job details below to publish live listings to applicants.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        
                        {/* Row 1: Title & Company Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Job Title <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Full Stack MERN Developer"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Company Name <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="e.g. Glorious Lab"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Location & Job Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Geographic Location <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Guwahati, Assam (or Remote)"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Employment Type <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative">
                                    <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
                                    >
                                        <option value="Full-time" className="bg-slate-900 text-white">Full-time</option>
                                        <option value="Part-time" className="bg-slate-900 text-white">Part-time</option>
                                        <option value="Internship" className="bg-slate-900 text-white">Internship</option>
                                        <option value="Remote" className="bg-slate-900 text-white">Remote</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Salary Range & Contact Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Salary Scale <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative">
                                    <IndianRupee className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="salaryRange"
                                        required
                                        value={formData.salaryRange}
                                        onChange={handleChange}
                                        placeholder="e.g. ₹6 LPA - ₹10 LPA"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Contact / HR Email <span className="text-indigo-400">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        name="contact"
                                        required
                                        value={formData.contact}
                                        onChange={handleChange}
                                        placeholder="e.g. hr@gloriouslab.com"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Full Width: Job Description */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Job Description & Requirements <span className="text-indigo-400">*</span>
                            </label>
                            <div className="relative">
                                <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide responsibilities, key tech stack requirements, and candidate qualifications..."
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-y"
                                ></textarea>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Publishing...</span>
                                    </>
                                ) : (
                                    <span>Deploy Listing</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};