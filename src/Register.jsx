import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // पासवर्ड दिखाने के लिए स्टेट

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "", 
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // यदि यूजर ने कोई रोल नहीं चुना है
        if (!formData.role) {
            toast.error("Please select a role (Job Seeker or Employer)");
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                "http://localhost:5000/api/users/register",
                formData
            );

            toast.success(data.message || "Registration Successful");

            navigate("/login");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Create Account
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Join our Job Search Portal
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="block mb-2 font-medium text-slate-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block mb-2 font-medium text-slate-700">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block mb-2 font-medium text-slate-700">
                            Register As
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                            required
                        >
                            <option value="" disabled>Select a role</option>
                            <option value="user">Job Seeker</option>
                            <option value="vendor">Employer / Vendor</option>
                        </select>
                    </div>

                    {/* Password with Show/Hide Toggle */}
                    <div>
                        <label className="block mb-2 font-medium text-slate-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-blue-600 pr-12"
                            />
                            {/* Eye Icon Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    // Eye Off Icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    // Eye On Icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};