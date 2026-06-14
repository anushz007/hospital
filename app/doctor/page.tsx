"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Appointment, Profile, Doctor } from "../../lib/db";
import AIAgent from "../components/AIAgent";

export default function DoctorDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "doctor") { router.push("/"); return; }
    setCurrentUser(user);
    const doc = db.getDoctor(user.id);
    if (doc) setDoctorProfile(doc);
    setAppointments(db.getAppointments(user.id, "doctor"));
  }, [router]);

  const handleUpdateStatus = (id: string, newStatus: Appointment["status"]) => {
    db.updateAppointmentStatus(id, newStatus);
    if (currentUser) setAppointments(db.getAppointments(currentUser.id, "doctor"));
  };
  const handleLogout = () => { db.logout(); router.push("/"); };
  if (!currentUser || !doctorProfile) return null;

  const pendingCount = appointments.filter(a => a.status === "pending").length;
  const confirmedCount = appointments.filter(a => a.status === "confirmed").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;

  const statusColor = (status: string) => {
    if (status === "confirmed") return { bg: "rgba(26,122,85,0.3)", color: "#6cf8bb", border: "rgba(100,220,160,0.2)" };
    if (status === "pending") return { bg: "rgba(122,100,0,0.3)", color: "#ffd700", border: "rgba(220,180,0,0.2)" };
    if (status === "cancelled") return { bg: "rgba(186,26,26,0.3)", color: "#ffdad6", border: "rgba(220,100,100,0.2)" };
    return { bg: "rgba(255,255,255,0.08)", color: "rgba(200,240,220,0.7)", border: "rgba(100,220,160,0.12)" };
  };

  return (
    <>
      <style>{`body { background: linear-gradient(145deg,#001208 0%,#002818 28%,#004a2a 60%,#006a3a 85%,#1a7a55 100%) fixed !important; }`}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-orb absolute rounded-full" style={{ top: "8%", right: "10%", width: 320, height: 320, background: "radial-gradient(circle, rgba(26,180,100,0.18) 0%, transparent 70%)" }} />
        <div className="float-orb-2 absolute rounded-full" style={{ bottom: "15%", left: "4%", width: 240, height: 240, background: "radial-gradient(circle, rgba(0,122,70,0.15) 0%, transparent 70%)" }} />
        <div className="float-orb-3 absolute rounded-full" style={{ top: "45%", right: "25%", width: 160, height: 160, background: "radial-gradient(circle, rgba(108,248,187,0.1) 0%, transparent 70%)" }} />
      </div>

      <div className="min-h-screen font-body flex flex-col relative z-10">
        <header className="glass-nav-doctor w-full top-0 sticky z-50">
          <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1440px] mx-auto">
            <Link href="/doctor" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: "#6cf8bb" }}>local_hospital</span>
              <span className="font-headline text-2xl font-bold text-white">MediFlow Doctor</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-6 mr-6">
                {[
                  { href: "/doctor", label: "Dashboard", active: true },
                  { href: "/doctor/records", label: "Write Diagnoses", active: false },
                ].map(({ href, label, active }) => (
                  <Link key={href} href={href} className="font-label text-sm"
                    style={{ color: active ? "#6cf8bb" : "rgba(200,240,220,0.65)", fontWeight: active ? 700 : 400 }}>{label}</Link>
                ))}
              </div>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-label"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(100,220,160,0.2)", color: "rgba(200,240,220,0.85)" }}>Sign Out</button>
              <div className="rounded-full overflow-hidden w-10 h-10 border-2" style={{ borderColor: "rgba(108,248,187,0.4)" }}>
                <img alt="Doctor Profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32 space-y-8">
          {/* Welcome */}
          <section className="glass-card-doctor p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "rgba(108,248,187,0.3)" }}>
                <img alt={doctorProfile.full_name} className="w-full h-full object-cover" src={doctorProfile.avatar_url} />
              </div>
              <div>
                <h1 className="font-headline text-2xl font-bold text-white">Welcome back, {doctorProfile.full_name}</h1>
                <p className="font-body text-sm" style={{ color: "rgba(200,240,220,0.7)" }}>
                  {doctorProfile.specialization} • {doctorProfile.department} Department
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              {[
                { value: appointments.length, label: "Total Booked", color: "#6cf8bb" },
                { value: confirmedCount, label: "Active Queue", color: "#6cf8bb" },
              ].map(({ value, label, color }) => (
                <div key={label} className="px-4 py-2 rounded-xl text-center" style={{ background: "rgba(108,248,187,0.1)", border: "1px solid rgba(108,248,187,0.15)" }}>
                  <p className="font-headline text-lg font-bold" style={{ color }}>{value}</p>
                  <p className="font-label text-[10px] uppercase" style={{ color: "rgba(200,240,220,0.6)" }}>{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Pending Approval", value: pendingCount, icon: "pending_actions", color: "#ffd700" },
              { label: "Confirmed Checks", value: confirmedCount, icon: "verified_user", color: "#6cf8bb" },
              { label: "Completed Checks", value: completedCount, icon: "check_circle", color: "#6cf8bb" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="glass-card-doctor p-6 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-label text-xs uppercase tracking-wider" style={{ color: "rgba(200,240,220,0.6)" }}>{label}</p>
                  <p className="font-headline text-3xl font-bold mt-1" style={{ color }}>{value}</p>
                </div>
                <span className="material-symbols-outlined text-[36px]" style={{ color: "rgba(108,248,187,0.35)" }}>{icon}</span>
              </div>
            ))}
          </section>

          {/* Patient Queue */}
          <section className="space-y-4">
            <h3 className="font-headline text-xl font-bold px-1 text-white">Patient Visit Schedule</h3>
            {appointments.length === 0 ? (
              <div className="glass-card-doctor p-10 rounded-xl text-center">
                <span className="material-symbols-outlined text-[48px] mb-2" style={{ color: "rgba(108,248,187,0.35)" }}>event_busy</span>
                <p className="font-headline text-lg font-semibold text-white mb-1">No appointments scheduled</p>
                <p className="font-body text-sm" style={{ color: "rgba(200,240,220,0.6)" }}>Appointments will appear here once patients book your slots.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(appt => {
                  const sc = statusColor(appt.status);
                  return (
                    <div key={appt.id} className="glass-card-doctor p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#6cf8bb" }} />
                          <h4 className="font-headline text-lg font-bold text-white">{appt.patient_name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-label uppercase"
                            style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                            {appt.status}
                          </span>
                        </div>
                        <p className="font-body text-xs" style={{ color: "rgba(200,240,220,0.65)" }}>
                          Scheduled: <strong className="text-white">{appt.appointment_date}</strong> at <strong className="text-white">{appt.appointment_time}</strong>
                        </p>
                        {appt.notes && (
                          <p className="font-body text-xs italic p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(108,248,187,0.1)", color: "rgba(200,240,220,0.65)" }}>
                            &ldquo;{appt.notes}&rdquo;
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        {appt.status === "pending" && (
                          <>
                            <button onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                              className="px-4 py-2 rounded-lg font-label text-xs font-semibold text-white glass-btn-doctor">Approve</button>
                            <button onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                              className="px-4 py-2 rounded-lg font-label text-xs font-semibold transition-all"
                              style={{ background: "rgba(186,26,26,0.3)", border: "1px solid rgba(220,100,100,0.25)", color: "#ffdad6" }}>Decline</button>
                          </>
                        )}
                        {appt.status === "confirmed" && (
                          <>
                            <Link href={`/doctor/records?patientId=${appt.patient_id}&apptId=${appt.id}`}
                              className="px-4 py-2 rounded-lg font-label text-xs font-semibold text-white glass-btn-doctor flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                              Diagnose & Complete
                            </Link>
                            <button onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                              className="px-4 py-2 rounded-lg font-label text-xs font-semibold"
                              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(100,220,160,0.15)", color: "rgba(200,240,220,0.7)" }}>Cancel</button>
                          </>
                        )}
                        {appt.status === "completed" && (
                          <span className="font-label text-xs font-semibold flex items-center gap-1" style={{ color: "#6cf8bb" }}>
                            <span className="material-symbols-outlined text-[16px]">check_circle</span> Checked Out
                          </span>
                        )}
                        {appt.status === "cancelled" && (
                          <span className="font-label text-xs" style={{ color: "rgba(200,240,220,0.4)" }}>Cancelled</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
      <AIAgent role="doctor" />
    </>
  );
}
