"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Appointment, Profile } from "../../lib/db";

export default function PatientDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") {
      router.push("/");
      return;
    }
    setCurrentUser(user);
    setAppointments(db.getAppointments(user.id, "patient"));
  }, [router]);

  const handleLogout = () => {
    db.logout();
    router.push("/");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-50 bg-surface-bright border-b border-outline-variant shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1440px] mx-auto">
          <Link href="/patient" className="flex items-center gap-2 cursor-pointer active:scale-95 duration-150">
            <span className="material-symbols-outlined text-primary font-headline text-3xl">
              local_hospital
            </span>
            <span className="font-headline text-2xl font-bold text-primary">
              MediFlow Health
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 mr-6">
              <Link href="/patient" className="font-label text-sm text-primary font-bold transition-colors">
                Home
              </Link>
              <Link href="/patient/book" className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors">
                Schedule
              </Link>
              <Link href="/patient/records" className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors">
                Records
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-outline rounded-lg text-xs font-label hover:bg-surface-variant transition-colors"
            >
              Sign Out
            </button>
            <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-primary-container">
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src={currentUser.avatar_url}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1440px] w-full mx-auto px-6 py-8 pb-32">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-xl bg-primary p-6 md:p-10 text-on-primary shadow-lg">
            <div className="relative z-10">
              <p className="font-label text-xs opacity-80 uppercase tracking-widest mb-1">
                Patient Portal
              </p>
              <h2 className="font-headline text-3xl md:text-5xl font-bold mb-3">
                Welcome back, {currentUser.full_name.split(" ")[0]}
              </h2>
              <p className="font-body text-base md:text-lg max-w-2xl opacity-90">
                Your health journey is our priority. You have {appointments.filter(a => a.status === 'confirmed').length} upcoming appointments scheduled.
              </p>
            </div>
            {/* Decorative subtle element */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
              <span className="material-symbols-outlined text-[320px]">
                health_and_safety
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Actions (Left Column Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-headline text-xl font-bold text-primary px-1">
              Quick Actions
            </h3>
            
            {/* Book Appointment Card */}
            <Link href="/patient/book" className="block w-full text-left group transition-all duration-300 hover:-translate-y-1">
              <div className="p-6 rounded-xl bg-secondary-container text-on-secondary-container shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-on-secondary-container text-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">
                      calendar_add_on
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-lg font-bold">Book Appointment</p>
                    <p className="font-body text-sm opacity-80">Find a doctor & schedule</p>
                  </div>
                </div>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </div>
            </Link>

            {/* View Records Card */}
            <Link href="/patient/records" className="block w-full text-left group transition-all duration-300 hover:-translate-y-1">
              <div className="p-6 rounded-xl bg-surface-container-high text-on-surface shadow-sm border border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">
                      history_edu
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-lg font-bold">View Records</p>
                    <p className="font-body text-sm text-on-surface-variant">Access your lab results</p>
                  </div>
                </div>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </div>
            </Link>

            {/* Wellness Tracker (Bento style small) */}
            <div className="p-6 rounded-xl bg-tertiary-container text-on-tertiary-container shadow-sm border border-tertiary-fixed-dim">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-[32px]">favorite</span>
                <span className="font-label text-xs bg-on-tertiary-container text-tertiary-container px-2 py-1 rounded">
                  Daily Goal
                </span>
              </div>
              <p className="font-headline text-3xl font-bold">8,432</p>
              <p className="font-label text-sm">Steps taken today (Goal: 10k)</p>
              <div className="w-full bg-on-tertiary-container/20 h-2 rounded-full mt-6 overflow-hidden">
                <div className="bg-on-tertiary-container h-full w-[84%] transition-all duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Main Content (Right Column Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline text-xl font-bold text-primary">
                Upcoming Appointments
              </h3>
              <Link href="/patient" className="text-primary font-label text-sm hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="p-10 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant text-center">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-2">
                    event_busy
                  </span>
                  <p className="font-headline text-lg font-semibold mb-1">No upcoming appointments</p>
                  <p className="font-body text-sm text-on-surface-variant mb-4">
                    Book an appointment with a specialist to get started on your health checkup.
                  </p>
                  <Link
                    href="/patient/book"
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary text-on-primary rounded-lg font-label text-sm hover:bg-primary-container transition-all"
                  >
                    Schedule Now
                  </Link>
                </div>
              ) : (
                appointments.map((appt) => {
                  const doc = db.getDoctor(appt.doctor_id);
                  const isCardiology = appt.department.toLowerCase() === "cardiology";
                  return (
                    <div
                      key={appt.id}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-surface-container-lowest shadow-sm border-l-4 ${
                        isCardiology ? "border-primary" : "border-secondary"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-surface-container flex-shrink-0 overflow-hidden border border-outline-variant">
                          <img
                            alt={appt.doctor_name}
                            className="w-full h-full object-cover"
                            src={doc?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCXsGnN1nRh7QCsR1nYIQXSSkCPiqrtD3p-hHuFz3o_zrnTD_4yfMdXKO8OycCOViackEvqqQntuANalP6hPbXFALp_7MHWbf7U8WJFhXw3Ki3bznZhTlS3aEPeTEyMkOzvVtL67wiXSXpbmbe6zXosyN7gWdTcgmtarXDwcAuGTKq4v-FMmHja4MWsnc6VH3HXcIKJZ0-7AXXHLcoTvz6diqcLsRj_YgjMJEBPwZ2S7-jN-49U5yxM-83F4KHagsPM769wUw8HDGA"}
                          />
                        </div>
                        <div>
                          <p className="font-headline text-lg font-bold text-on-surface">
                            {appt.doctor_name}
                          </p>
                          <p className="font-body text-sm text-on-surface-variant">
                            {appt.department} Department • {isCardiology ? "Room 302" : "Room 105"}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-primary">
                            <span className="material-symbols-outlined text-[18px]">
                              calendar_today
                            </span>
                            <span className="font-label text-sm">
                              {appt.appointment_date} • {appt.appointment_time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4 justify-between md:justify-end">
                        <span
                          className={`px-3 py-1 rounded-full font-label text-xs flex items-center gap-1 ${
                            appt.status === "confirmed"
                              ? "bg-secondary-container text-on-secondary-container"
                              : appt.status === "pending"
                              ? "bg-tertiary-container text-on-tertiary-container"
                              : appt.status === "cancelled"
                              ? "bg-error-container text-on-error-container"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {appt.status === "confirmed"
                              ? "check_circle"
                              : appt.status === "pending"
                              ? "hourglass_empty"
                              : appt.status === "cancelled"
                              ? "cancel"
                              : "assignment_turned_in"}
                          </span>
                          <span className="capitalize">{appt.status}</span>
                        </span>
                        {appt.status === "confirmed" && (
                          <Link
                            href="/patient/payment"
                            className="px-3 py-1.5 bg-primary text-on-primary text-xs font-label rounded-lg hover:bg-primary-container transition-all"
                          >
                            Pay Bill
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Recent Medical Updates */}
            <div className="mt-8 pt-8 border-t border-outline-variant">
              <h3 className="font-headline text-xl font-bold text-primary mb-4 px-1">
                Recent Medical Updates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/patient/records"
                  className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-4 group cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">bloodtype</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label text-sm text-on-surface font-bold truncate">
                      Blood Panel Results
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      Uploaded 2 days ago
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                    download
                  </span>
                </Link>

                <Link
                  href="/patient/records"
                  className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-4 group cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label text-sm text-on-surface font-bold truncate">
                      Prescription: Lipitor
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      Renewed by Dr. Wilson
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                    visibility
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant shadow-lg md:hidden">
        <div className="flex justify-around items-center px-4 pb-4 pt-2">
          <Link href="/patient" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl p-2 active:scale-90 transition-transform duration-200">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span className="font-label text-[10px] mt-0.5">Home</span>
          </Link>
          <Link href="/patient/book" className="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:text-primary active:scale-90 transition-transform duration-200">
            <span className="material-symbols-outlined">event</span>
            <span className="font-label text-[10px] mt-0.5">Schedule</span>
          </Link>
          <Link href="/patient/records" className="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:text-primary active:scale-90 transition-transform duration-200">
            <span className="material-symbols-outlined">history_edu</span>
            <span className="font-label text-[10px] mt-0.5">Records</span>
          </Link>
        </div>
      </nav>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/patient/book"
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 rounded-2xl bg-primary text-on-primary shadow-xl flex items-center justify-center active:scale-95 transition-transform duration-150 z-40 group hover:bg-primary-container"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
        <span className="absolute right-full mr-4 py-1.5 px-3 bg-inverse-surface text-inverse-on-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-label text-sm hidden md:block">
          New Appointment
        </span>
      </Link>
    </div>
  );
}
