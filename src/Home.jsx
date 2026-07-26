import React from "react";
import { Login } from "./Login";
export const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-600">
          Job Search Portal
        </h1>

        <p className="mt-4 text-slate-600 text-lg">
          Find your dream job with thousands of verified opportunities.
        </p>
      </div>
      <Login />
    </div>
  );
};