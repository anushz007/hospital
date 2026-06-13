"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Appointment, Profile, Doctor } from "../../lib/db";

export default function DoctorDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "doctor") {
      router.push("/");
      return;
    }
    setCurrentUser(user);
    const doc = db.getDoctor(user.id);
    if (doc) {
      setDoctorProfile(doc);
    }
    setAppointments(db.getAppointments(user.id, "doctor"));
  }, [router]);

  const handleUpdateStatus = (id: string, newStatus: Appointment["status"]) => {
    const updated = db.updateAppointmentStatus(id, newStatus);
    if (updated && currentUser) {
      setAppointments(db.getAppointments(currentUser.id, "doctor"));
    }
  };

  const handleLogout = () => {
    db.logout();
    router.push("/");
  };

  if (!currentUser || !doctorProfile) return null;

  // Compute stats
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface-bright border-b border-outline-variant shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1440px] mx-auto">
          <Link href="/doctor" className="flex items-center gap-2 cursor-pointer active:scale-95 duration-150">
            <span className="material-symbols-outlined text-primary font-headline text-3xl">
              local_hospital
            </span>
            <span className="font-headline text-2xl font-bold text-primary">MediFlow Doctor</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 mr-6">
              <Link href="/doctor" className="font-label text-sm text-primary font-bold transition-colors">
                Dashboard
              </Link>
              <Link href={`/doctor/records`} className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors">
                Write Diagnoses
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-outline rounded-lg text-xs font-label hover:bg-surface-variant transition-colors"
            >
              Sign Out
            </button>
            <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-primary-container">
              <img alt="Doctor Profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32 space-y-8">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-outline-variant flex-shrink-0">
              <img alt={doctorProfile.full_name} className="w-full h-full object-cover" src={doctorProfile.avatar_url} />
            </div>
            <div>
              <h2 className="font-headline text-2xl font-bold text-primary">
                Welcome back, {doctorProfile.full_name}
              </h2>
              <p className="font-body text-sm text-on-surface-variant">
                {doctorProfile.specialization} • {doctorProfile.department} Department
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-surface-container rounded-lg text-center">
              <p className="font-headline text-lg font-bold text-primary">{appointments.length}</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase">Total Booked</p>
            </div>
            <div className="px-4 py-2 bg-secondary-container rounded-lg text-center">
              <p className="font-headline text-lg font-bold text-on-secondary-container">{confirmedCount}</p>
              <p className="font-label text-[10px] text-on-secondary-container uppercase">Active Queue</p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between">
            <div>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                Pending Approval
              </p>
              <p className="font-headline text-3xl font-bold mt-1 text-tertiary-container">
                {pendingCount}
              </p>
            </div>
            <span className="material-symbols-outlined text-[36px] text-outline">pending_actions</span>
          </div>

          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between">
            <div>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                Confirmed Checks
              </p>
              <p className="font-headline text-3xl font-bold mt-1 text-primary">
                {confirmedCount}
              </p>
            </div>
            <span className="material-symbols-outlined text-[36px] text-outline">verified_user</span>
          </div>

          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-between">
            <div>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                Completed Checks
              </p>
              <p className="font-headline text-3xl font-bold mt-1 text-secondary">
                {completedCount}
              </p>
            </div>
            <span className="material-symbols-outlined text-[36px] text-outline">check_circle</span>
          </div>
        </section>

        {/* Patient Queue / Appointment Manager */}
        <section className="space-y-4">
          <h3 className="font-headline text-xl font-bold text-primary px-1">
            Patient Visit Schedule
          </h3>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="p-10 rounded-xl bg-surface-container-lowest border border-outline-variant text-center">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">
                  event_busy
                </span>
                <p className="font-headline text-lg font-semibold mb-1">No appointments scheduled</p>
                <p className="font-body text-sm text-on-surface-variant">
                  When patients select your slots, appointments will be displayed here.
                </p>
              </div>
            ) : (
              appointments.map((appt) => {
                return (
                  <div
                    key={appt.id}
                    className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></span>
                        <h4 className="font-headline text-lg font-bold text-on-surface">
                          {appt.patient_name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-label uppercase tracking-wider ${
                            appt.status === "confirmed"
                              ? "bg-secondary-container text-on-secondary-container"
                              : appt.status === "pending"
                              ? "bg-tertiary-container text-on-tertiary-container"
                              : appt.status === "cancelled"
                              ? "bg-error-container text-on-error-container"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <p className="font-body text-xs text-on-surface-variant">
                        Scheduled: <strong>{appt.appointment_date}</strong> at <strong>{appt.appointment_time}</strong>
                      </p>
                      {appt.notes && (
                        <p className="font-body text-xs text-on-surface-variant italic bg-surface p-3 rounded border border-outline-variant mt-2">
                          &ldquo;{appt.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      {appt.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                            className="px-4 py-2 bg-secondary text-on-secondary hover:bg-secondary/90 transition-all font-label text-xs font-semibold rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                            className="px-4 py-2 bg-transparent border border-error text-error hover:bg-error-container hover:text-on-error-container transition-all font-label text-xs font-semibold rounded-lg"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {appt.status === "confirmed" && (
                        <>
                          <Link
                            href={`/doctor/records?patientId=${appt.patient_id}&apptId=${appt.id}`}
                            className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container transition-all font-label text-xs font-semibold rounded-lg flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                            Diagnose &amp; Complete
                          </Link>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                            className="px-4 py-2 bg-transparent border border-outline text-on-surface-variant hover:bg-surface-variant transition-all font-label text-xs font-semibold rounded-lg"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {appt.status === "completed" && (
                        <span className="text-secondary font-label text-xs font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Checked Out
                        </span>
                      )}

                      {appt.status === "cancelled" && (
                        <span className="text-outline font-label text-xs font-semibold">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
