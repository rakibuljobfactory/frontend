import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";

export const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        "https://backend-tau-two-76.vercel.app/api/vendor/vendor-dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(data.dashboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
          Loading Dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Welcome */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-3xl font-bold">
            Welcome {dashboard.vendor.name}
          </h1>

          <p className="text-gray-500 mt-2">
            {dashboard.vendor.email}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

          <Card
            title="Total Jobs"
            value={dashboard.overview.totalJobs}
          />

          <Card
            title="Active Jobs"
            value={dashboard.overview.activeJobs}
          />

          <Card
            title="Draft Jobs"
            value={dashboard.overview.draftJobs}
          />

          <Card
            title="Closed Jobs"
            value={dashboard.overview.closedJobs}
          />

          <Card
            title="Archived Jobs"
            value={dashboard.overview.archivedJobs}
          />

        </div>

        {/* Analytics */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">
              Jobs By Type
            </h2>

            {dashboard.analytics.jobsByType.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b py-2"
              >
                <span>{item._id}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">
              Jobs By Location
            </h2>

            {dashboard.analytics.jobsByLocation.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b py-2"
              >
                <span>{item._id}</span>
                <span>{item.count}</span>
              </div>
            ))}

          </div>

        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow mt-10 p-6">

          <h2 className="text-2xl font-semibold mb-5">
            Recent Jobs
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-3">Title</th>

                  <th className="text-left p-3">Location</th>

                  <th className="text-left p-3">Type</th>

                  <th className="text-left p-3">Status</th>

                </tr>

              </thead>

              <tbody>

                {dashboard.recentJobs.map((job) => (

                  <tr key={job._id} className="border-b">

                    <td className="p-3">{job.title}</td>

                    <td className="p-3">{job.location}</td>

                    <td className="p-3">{job.jobType}</td>

                    <td className="p-3">

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                        {job.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
};

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500">{title}</p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}