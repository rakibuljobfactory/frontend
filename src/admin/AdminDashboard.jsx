import React from 'react'
import { Navbar } from './Navbar'

export const AdminDashboard = () => {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
        <Navbar activeTab="all" setActiveTab={() => {}} pendingCount={5} />
        <section className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800">Welcome to the Admin Dashboard</h2>
            <p className="mt-2 text-sm text-slate-600">Use the navigation above to manage vendors and view analytics.</p>
        </section>
    </main>
  )
}
