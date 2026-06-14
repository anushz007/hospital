"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Appointment, Profile } from "../../lib/db";
import AIAgent from "../components/AIAgent";
import HospitalMarquee from "../components/HospitalMarquee";

export default function PatientDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") { router.push("/"); return; }
    setCurrentUser(user);
    setAppointments(db.getAppointments(user.id, "patient"));
  }, [router]);

  const handleLogout = () => { db.logout(); router.push("/"); };
  if (!currentUser) return null;

  const confirmedCount = appointments.filter(a => a.status === "confirmed").length;

  return (
    <>
      <style>{`body { background: linear-gradient(145deg,#1a0800 0%,#3d1200 28%,#7a2c00 60%,#b85535 85%,#CF6B3E 100%) fixed !important; }`}</style>

      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-orb absolute rounded-full" style={{ top: "8%", right: "12%", width: 340, height: 340, background: "radial-gradient(circle, rgba(232,130,74,0.22) 0%, transparent 70%)" }} />
        <div className="float-orb-2 absolute rounded-full" style={{ bottom: "20%", left: "5%", width: 260, height: 260, background: "radial-gradient(circle, rgba(207,107,62,0.18) 0%, transparent 70%)" }} />
        <div className="float-orb-3 absolute rounded-full" style={{ top: "50%", right: "30%", width: 180, height: 180, background: "radial-gradient(circle, rgba(184,85,53,0.14) 0%, transparent 70%)" }} />
      </div>

      <div className="min-h-screen font-body flex flex-col relative z-10">
        {/* Glass NavBar */}
        <header className="glass-nav w-full top-0 sticky z-50">
          <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1440px] mx-auto">
            <Link href="/patient" className="flex items-center gap-2 cursor-pointer active:scale-95 duration-150">
              <span className="material-symbols-outlined font-headline text-3xl" style={{ color: "#F5A878" }}>local_hospital</span>
              <span className="font-headline text-2xl font-bold" style={{ color: "#fff" }}>MediFlow Health</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-6 mr-6">
                {[
                  { href: "/patient", label: "Home", active: true },
                  { href: "/patient/book", label: "Schedule", active: false },
                  { href: "/patient/records", label: "Records", active: false },
                ].map(({ href, label, active }) => (
                  <Link key={href} href={href} className="font-label text-sm transition-colors"
                    style={{ color: active ? "#F5A878" : "rgba(255,220,190,0.7)", fontWeight: active ? 700 : 400 }}>
                    {label}
                  </Link>
                ))}
              </div>
              <button onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-label transition-all"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,180,120,0.25)", color: "rgba(255,220,190,0.85)" }}>
                Sign Out
              </button>
              <div className="rounded-full overflow-hidden w-10 h-10 border-2" style={{ borderColor: "rgba(245,168,120,0.5)" }}>
                <img alt="User Profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-[1440px] w-full mx-auto px-6 py-8 pb-32">
          {/* Welcome Banner */}
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-2xl p-6 md:p-10"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,200,160,0.18)" }}>
              <div className="relative z-10">
                <p className="font-label text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,210,170,0.95)" }}>Patient Portal</p>
                <h1 className="font-headline text-3xl md:text-5xl font-bold mb-3 text-white">
                  Welcome back, {currentUser.full_name.split(" ")[0]}
                </h1>
                <p className="font-body text-base md:text-lg max-w-2xl" style={{ color: "rgba(255,230,210,0.95)" }}>
                  Your health journey is our priority. You have <strong style={{ color: "#F5A878" }}>{confirmedCount}</strong> upcoming appointments scheduled.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "320px" }}>health_and_safety</span>
              </div>
            </div>
          </section>

          {/* ── Hospital partners marquee ── */}
          <HospitalMarquee />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-headline text-lg font-bold px-1" style={{ color: "rgba(255,220,190,0.9)" }}>Quick Actions</h3>

              <Link href="/patient/book" className="block group transition-all duration-300 hover:-translate-y-1">
                <div className="glass-card p-5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(207,107,62,0.45)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#ffcfa0", fontSize: "26px" }}>calendar_add_on</span>
                    </div>
                    <div>
                      <p className="font-headline text-base font-bold text-white">Book Appointment</p>
                      <p className="font-body text-xs" style={{ color: "rgba(255,225,200,0.95)" }}>Find a doctor &amp; schedule</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ color: "rgba(255,200,160,0.9)" }}>chevron_right</span>
                </div>
              </Link>

              <Link href="/patient/records" className="block group transition-all duration-300 hover:-translate-y-1">
                <div className="glass-card p-5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(122,44,0,0.55)" }}>
                      <span className="material-symbols-outlined" style={{ color: "#ffcfa0", fontSize: "26px" }}>history_edu</span>
                    </div>
                    <div>
                      <p className="font-headline text-base font-bold text-white">View Records</p>
                      <p className="font-body text-xs" style={{ color: "rgba(255,225,200,0.95)" }}>Access your lab results</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ color: "rgba(255,200,160,0.9)" }}>chevron_right</span>
                </div>
              </Link>

              {/* Wellness tracker */}
              <div className="glass-card p-5 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="material-symbols-outlined text-[32px]" style={{ color: "#F5A878" }}>favorite</span>
                  <span className="font-label text-xs px-2 py-1 rounded-full" style={{ background: "rgba(207,107,62,0.5)", color: "#fff" }}>Daily Goal</span>
                </div>
                <p className="font-headline text-3xl font-bold text-white">8,432</p>
                <p className="font-label text-sm mt-1" style={{ color: "rgba(255,225,200,0.95)" }}>Steps today (Goal: 10k)</p>
                <div className="w-full h-2 rounded-full mt-4 overflow-hidden" style={{ background: "rgba(255,180,120,0.15)" }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: "84%", background: "linear-gradient(90deg, #CF6B3E, #F5A878)" }} />
                </div>
              </div>
            </div>

            {/* Appointments + Updates */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-headline text-lg font-bold" style={{ color: "rgba(255,220,190,0.9)" }}>Upcoming Appointments</h3>
                <Link href="/patient" className="font-label text-sm hover:underline" style={{ color: "#F5A878" }}>View All</Link>
              </div>

              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="glass-card p-10 rounded-xl text-center">
                    <span className="material-symbols-outlined text-[48px] mb-2" style={{ color: "rgba(255,180,120,0.5)" }}>event_busy</span>
                    <p className="font-headline text-lg font-semibold text-white mb-1">No upcoming appointments</p>
                    <p className="font-body text-sm mb-4" style={{ color: "rgba(255,225,200,0.95)" }}>Book an appointment with a specialist to get started.</p>
                    <Link href="/patient/book" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-label text-sm text-white glass-btn-patient">
                      Schedule Now
                    </Link>
                  </div>
                ) : (
                  appointments.map((appt) => {
                    const doc = db.getDoctor(appt.doctor_id);
                    return (
                      <div key={appt.id} className="glass-card p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                        style={{ borderLeft: "3px solid rgba(207,107,62,0.6)" }}>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: "rgba(245,168,120,0.3)" }}>
                            <img alt={appt.doctor_name} className="w-full h-full object-cover"
                              src={doc?.avatar_url || ""} />
                          </div>
                          <div>
                            <p className="font-headline text-base font-bold text-white">{appt.doctor_name}</p>
                             <p className="font-body text-xs font-semibold" style={{ color: "rgba(255,225,200,0.95)" }}>{appt.department} Department</p>
                             <div className="flex items-center gap-1 mt-1" style={{ color: "#ffcfa0" }}>
                               <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                               <span className="font-label text-xs font-semibold">{appt.appointment_date} • {appt.appointment_time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full font-label text-xs capitalize"
                            style={{
                              background: appt.status === "confirmed" ? "rgba(26,122,85,0.3)" : appt.status === "pending" ? "rgba(184,85,53,0.3)" : "rgba(186,26,26,0.3)",
                              color: appt.status === "confirmed" ? "#6cf8bb" : appt.status === "pending" ? "#F5A878" : "#ffdad6",
                              border: "1px solid rgba(255,200,160,0.15)"
                            }}>
                            {appt.status}
                          </span>
                          {appt.status === "confirmed" && (
                            <Link href="/patient/payment" className="px-3 py-1.5 rounded-lg text-xs font-label text-white glass-btn-patient">Pay Bill</Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-6 border-t" style={{ borderColor: "rgba(255,180,120,0.2)" }}>
                <h3 className="font-headline text-lg font-bold mb-4 px-1 text-white">Recent Medical Updates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: "bloodtype", label: "Blood Panel Results", sub: "Uploaded 2 days ago", action: "download" },
                    { icon: "description", label: "Prescription: Lipitor", sub: "Renewed by Dr. Wilson", action: "visibility" },
                  ].map((item) => (
                    <Link key={item.label} href="/patient/records"
                      className="glass-card p-4 rounded-xl flex items-center gap-4 group cursor-pointer hover:-translate-y-0.5 transition-all">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(207,107,62,0.45)" }}>
                        <span className="material-symbols-outlined" style={{ color: "#ffcfa0" }}>{item.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-label text-sm font-bold text-white truncate">{item.label}</p>
                        <p className="font-body text-xs" style={{ color: "rgba(255,225,200,0.95)" }}>{item.sub}</p>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: "rgba(255,200,160,0.9)", fontSize: "20px" }}>{item.action}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="glass-bottom-nav fixed bottom-0 left-0 w-full z-50 md:hidden">
          <div className="flex justify-around items-center px-4 pb-4 pt-2">
            {[
              { href: "/patient", icon: "dashboard", label: "Home", active: true },
              { href: "/patient/book", icon: "event", label: "Schedule", active: false },
              { href: "/patient/records", icon: "history_edu", label: "Records", active: false },
            ].map(({ href, icon, label, active }) => (
              <Link key={href} href={href} className="flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-90"
                style={{ background: active ? "rgba(207,107,62,0.3)" : "transparent", color: active ? "#F5A878" : "rgba(255,200,160,0.5)" }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                <span className="font-label text-[10px] mt-0.5">{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* FAB */}
        <Link href="/patient/book"
          className="glass-btn-patient fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 rounded-2xl flex items-center justify-center active:scale-95 transition-all z-40 group">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </Link>
      </div>
      <AIAgent role="patient" />
    </>
  );
}
