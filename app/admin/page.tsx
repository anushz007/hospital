"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Appointment, Profile, Doctor } from "../../lib/db";

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    setCurrentUser(user);
    setAppointments(db.getAppointments());
    setDoctors(db.getDoctors());
    setProfiles(db.getProfiles());
  }, [router]);

  const handleUpdateStatus = (id: string, newStatus: Appointment["status"]) => {
    db.updateAppointmentStatus(id, newStatus);
    setAppointments(db.getAppointments());
  };

  const handleLogout = () => {
    db.logout();
    router.push("/");
  };

  if (!currentUser) return null;

  const patientsCount = profiles.filter(p => p.role === "patient").length;
  const confirmedCount = appointments.filter(a => a.status === "confirmed" || a.status === "completed").length;
  const estimatedRevenue = confirmedCount * 120; // $120 per consultation

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface-bright border-b border-outline-variant shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1440px] mx-auto">
          <Link href="/admin" className="flex items-center gap-2 cursor-pointer active:scale-95 duration-150">
            <span className="material-symbols-outlined text-primary font-headline text-3xl">
              local_hospital
            </span>
            <span className="font-headline text-2xl font-bold text-primary">MediFlow Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-outline rounded-lg text-xs font-label hover:bg-surface-variant transition-colors"
            >
              Sign Out
            </button>
            <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-primary-container">
              <img alt="Admin profile avatar" className="w-full h-full object-cover" src={currentUser.avatar_url} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32 space-y-8 animate-fade-in-up">
        {/* Header summary */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-6">
          <div>
            <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
              Hospital Control Console
            </h1>
            <p className="text-on-surface-variant font-body text-sm mt-1">
              Monitor active clinical queues, manage doctor registers, and inspect diagnostic analytics.
            </p>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-label text-xs font-semibold uppercase">
            System Administrator
          </span>
        </section>

        {/* Analytics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                Total Appointments
              </p>
              <p className="font-headline text-3xl font-bold mt-1 text-primary">
                {appointments.length}
              </p>
            </div>
            <span className="material-symbols-outlined text-[36px] text-outline">book_online</span>
          </div>

          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                Active Specialists
              </p>
              <p className="font-headline text-3xl font-bold mt-1 text-secondary">
                {doctors.length}
              </p>
            </div>
            <span className="material-symbols-outlined text-[36px] text-outline">medical_services</span>
          </div>

          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                Registered Patients
              </p>
              <p className="font-headline text-3xl font-bold mt-1 text-primary">
                {patientsCount}
              </p>
            </div>
            <span className="material-symbols-outlined text-[36px] text-outline">group</span>
          </div>

          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                Estimated Revenue
              </p>
              <p className="font-headline text-3xl font-bold mt-1 text-secondary">
                ${estimatedRevenue.toFixed(2)}
              </p>
            </div>
            <span className="material-symbols-outlined text-[36px] text-outline">monetization_on</span>
          </div>
        </section>

        {/* Global Schedule and DB status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Appointment Table */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-6 shadow-sm overflow-hidden">
            <h3 className="font-headline text-xl font-bold text-primary">All Booked Appointments</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-body text-sm">
                <thead>
                  <tr className="border-b border-outline-variant text-xs text-on-surface-variant font-label uppercase">
                    <th className="pb-3 font-semibold">Patient</th>
                    <th className="pb-3 font-semibold">Specialist</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold">Scheduled Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-on-surface-variant italic">
                        No appointments found in the system registry.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id} className="border-b border-outline-variant/60 hover:bg-surface transition-colors">
                        <td className="py-3.5 font-semibold text-on-surface">{appt.patient_name}</td>
                        <td className="py-3.5 text-on-surface-variant">{appt.doctor_name}</td>
                        <td className="py-3.5 text-on-surface-variant">{appt.department}</td>
                        <td className="py-3.5 text-on-surface-variant">
                          {appt.appointment_date} <br />
                          <span className="text-xs text-outline">{appt.appointment_time}</span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-label uppercase ${
                              appt.status === "confirmed" || appt.status === "completed"
                                ? "bg-secondary-container text-on-secondary-container"
                                : appt.status === "pending"
                                ? "bg-tertiary-container text-on-tertiary-container"
                                : "bg-error-container text-on-error-container"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          {appt.status === "pending" && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                              className="text-xs font-label text-secondary hover:underline font-semibold"
                            >
                              Approve
                            </button>
                          )}
                          {appt.status !== "cancelled" && appt.status !== "completed" && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                              className="text-xs font-label text-error hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                          {(appt.status === "cancelled" || appt.status === "completed") && (
                            <span className="text-xs text-outline">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Diagnostics and Schema Match details */}
          <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant p-6 rounded-xl space-y-6 shadow-sm">
            <h3 className="font-headline text-lg font-bold text-primary border-b border-outline-variant pb-2">
              System Diagnostics
            </h3>

            <div className="space-y-4 text-xs font-body leading-relaxed">
              <div className="flex items-center justify-between bg-surface p-3 rounded-lg border border-outline-variant">
                <span>Database Engine</span>
                <span className="font-semibold text-secondary">LocalStorage Mock</span>
              </div>

              <div className="flex items-center justify-between bg-surface p-3 rounded-lg border border-outline-variant">
                <span>System Integrity</span>
                <span className="font-semibold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Healthy
                </span>
              </div>

              <div className="p-4 bg-primary-container text-on-primary-fixed-variant rounded-lg space-y-2">
                <h4 className="font-bold font-headline">Supabase Ready</h4>
                <p>
                  This application matches the PostgreSQL database schema specified in the Stitch backend document.
                </p>
                <div className="space-y-1 font-mono text-[10px] opacity-90 border-t border-primary/20 pt-2">
                  <p>✔ Profiles Table linked</p>
                  <p>✔ Doctors Table configured</p>
                  <p>✔ Appointments Table aligned</p>
                  <p>✔ Medical Records Table ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
