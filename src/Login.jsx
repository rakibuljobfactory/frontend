import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Check
} from "lucide-react";

export const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        if (savedEmail && savedPassword) {
            setFormData({ email: savedEmail, password: savedPassword });
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await axios.post(
                "https://backend-8sm3.onrender.com/api/users/login",
                formData
            );

            toast.success(data.message || "Login Successful");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", formData.email);
                localStorage.setItem("rememberedPassword", formData.password);
            } else {
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedPassword");
            }

            const userRole = data.user?.role?.toLowerCase();
            const isVerified = data.user?.isVerified;
            const isApproved = data.user?.isApproved;

            if (userRole === "admin") {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/admin-dashboard");
            } else if (userRole === "vendor") {
                // Gatekeeper Validation Check
                if (isVerified || isApproved) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    navigate("/vendor-dashboard");
                } else {
                    // Explicitly remove credentials if validation fails
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    toast.error("Your vendor account is pending verification or admin approval.");
                    return;
                }
            } else {
                // Default User / Job Seeker Path
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/user-dashboard");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-8 sm:py-12 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            {/* Background Ambient Glow Spheres */}
            <div className="absolute top-0 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Portal Access
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                        Log in to manage job listings or explore open positions.
                    </p>
                </div>

                {/* Free Portal Badge Notice */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-6 flex items-center gap-2.5 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% Free Job Portal for Candidates & Employers</span>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-12 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition shadow-inner"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 transition select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                            />
                            <span>Remember me</span>
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                        <span>{loading ? "Signing in..." : "Sign In"}</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition"
                    >
                        Create an Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};