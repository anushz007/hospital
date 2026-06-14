"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Appointment, Profile, Doctor } from "../../lib/db";
import AIAgent from "../components/AIAgent";

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "admin") { router.push("/"); return; }
    setCurrentUser(user);
    setAppointments(db.getAppointments());
    setDoctors(db.getDoctors());
    setProfiles(db.getProfiles());
  }, [router]);

  const handleUpdateStatus = (id: string, newStatus: Appointment["status"]) => {
    db.updateAppointmentStatus(id, newStatus);
    setAppointments(db.getAppointments());
  };
  const handleLogout = () => { db.logout(); router.push("/"); };
  if (!currentUser) return null;

  const patientsCount = profiles.filter(p => p.role === "patient").length;
  const confirmedCount = appointments.filter(a => a.status === "confirmed" || a.status === "completed").length;
  const estimatedRevenue = confirmedCount * 120;

  const statusBadge = (status: string) => {
    if (status === "confirmed" || status === "completed") return { bg: "rgba(26,122,85,0.3)", color: "#6cf8bb", border: "rgba(100,220,160,0.2)" };
    if (status === "pending") return { bg: "rgba(92,58,138,0.4)", color: "#c4b5fd", border: "rgba(160,120,220,0.25)" };
    return { bg: "rgba(186,26,26,0.3)", color: "#ffdad6", border: "rgba(220,100,100,0.2)" };
  };

  return (
    <>
      <style>{`body { background: linear-gradient(145deg,#07030f 0%,#140a26 28%,#241540 60%,#3a2060 85%,#5c3a8a 100%) fixed !important; }`}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-orb absolute rounded-full" style={{ top: "8%", right: "8%", width: 340, height: 340, background: "radial-gradient(circle, rgba(140,100,220,0.18) 0%, transparent 70%)" }} />
        <div className="float-orb-2 absolute rounded-full" style={{ bottom: "18%", left: "4%", width: 250, height: 250, background: "radial-gradient(circle, rgba(92,58,138,0.15) 0%, transparent 70%)" }} />
        <div className="float-orb-3 absolute rounded-full" style={{ top: "50%", right: "28%", width: 170, height: 170, background: "radial-gradient(circle, rgba(180,140,240,0.1) 0%, transparent 70%)" }} />
      </div>

      <div className="min-h-screen font-body flex flex-col relative z-10 animate-fade-in-up">
        <header className="glass-nav-admin w-full top-0 sticky z-50">
          <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1440px] mx-auto">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: "#c4b5fd" }}>local_hospital</span>
              <span className="font-headline text-2xl font-bold text-white">MediFlow Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-label"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(160,120,220,0.2)", color: "rgba(220,200,255,0.85)" }}>Sign Out</button>
              <div className="rounded-full overflow-hidden w-10 h-10 border-2" style={{ borderColor: "rgba(196,181,253,0.4)" }}>
                <img alt="Admin profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32 space-y-8">
          {/* Header */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6"
            style={{ borderBottom: "1px solid rgba(160,120,220,0.15)" }}>
            <div>
              <h1 className="font-headline text-3xl font-bold text-white tracking-tight">Hospital Control Console</h1>
              <p className="font-body text-sm mt-1" style={{ color: "rgba(220,200,255,0.65)" }}>
                Monitor active clinical queues, manage doctor registers, and inspect analytics.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full font-label text-xs font-semibold uppercase"
              style={{ background: "rgba(92,58,138,0.4)", border: "1px solid rgba(196,181,253,0.25)", color: "#c4b5fd" }}>
              System Administrator
            </span>
          </section>

          {/* Analytics Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Total Appointments", value: appointments.length, icon: "book_online", color: "#c4b5fd" },
              { label: "Active Specialists", value: doctors.length, icon: "medical_services", color: "#6cf8bb" },
              { label: "Registered Patients", value: patientsCount, icon: "group", color: "#c4b5fd" },
              { label: "Estimated Revenue", value: `$${estimatedRevenue.toFixed(2)}`, icon: "monetization_on", color: "#6cf8bb" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="glass-card-admin p-6 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-label text-xs uppercase tracking-wider" style={{ color: "rgba(220,200,255,0.55)" }}>{label}</p>
                  <p className="font-headline text-3xl font-bold mt-1" style={{ color }}>{value}</p>
                </div>
                <span className="material-symbols-outlined text-[36px]" style={{ color: "rgba(196,181,253,0.3)" }}>{icon}</span>
              </div>
            ))}
          </section>

          {/* Schedule + Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Appointment Table */}
            <div className="lg:col-span-8 glass-card-admin p-6 rounded-2xl space-y-5 overflow-hidden">
              <h3 className="font-headline text-xl font-bold text-white">All Booked Appointments</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-body text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(160,120,220,0.15)" }}>
                      {["Patient", "Specialist", "Department", "Scheduled Date", "Status", "Actions"].map((h, i) => (
                        <th key={h} className={`pb-3 font-label text-xs uppercase font-semibold ${i === 5 ? "text-right" : ""}`}
                          style={{ color: "rgba(220,200,255,0.55)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center italic" style={{ color: "rgba(220,200,255,0.45)" }}>
                          No appointments found in the system registry.
                        </td>
                      </tr>
                    ) : appointments.map(appt => {
                      const sb = statusBadge(appt.status);
                      return (
                        <tr key={appt.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(160,120,220,0.08)" }}>
                          <td className="py-3.5 font-semibold text-white">{appt.patient_name}</td>
                          <td className="py-3.5" style={{ color: "rgba(220,200,255,0.7)" }}>{appt.doctor_name}</td>
                          <td className="py-3.5" style={{ color: "rgba(220,200,255,0.7)" }}>{appt.department}</td>
                          <td className="py-3.5" style={{ color: "rgba(220,200,255,0.7)" }}>
                            {appt.appointment_date}<br />
                            <span className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>{appt.appointment_time}</span>
                          </td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-label uppercase"
                              style={{ background: sb.bg, color: sb.color, border: `1px solid ${sb.border}` }}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right space-x-3">
                            {appt.status === "pending" && (
                              <button onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                                className="text-xs font-label font-semibold hover:underline" style={{ color: "#6cf8bb" }}>Approve</button>
                            )}
                            {appt.status !== "cancelled" && appt.status !== "completed" && (
                              <button onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                                className="text-xs font-label hover:underline" style={{ color: "#fca5a5" }}>Cancel</button>
                            )}
                            {(appt.status === "cancelled" || appt.status === "completed") && (
                              <span className="text-xs" style={{ color: "rgba(196,181,253,0.3)" }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Diagnostics */}
            <div className="lg:col-span-4 glass-card-admin p-6 rounded-2xl space-y-5">
              <h3 className="font-headline text-lg font-bold text-white pb-2" style={{ borderBottom: "1px solid rgba(160,120,220,0.15)" }}>
                System Diagnostics
              </h3>
              <div className="space-y-3 text-xs font-body leading-relaxed">
                {[
                  { label: "Database Engine", value: "LocalStorage Mock", color: "#6cf8bb" },
                  { label: "System Integrity", value: "Healthy ✓", color: "#6cf8bb" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(160,120,220,0.12)" }}>
                    <span style={{ color: "rgba(220,200,255,0.7)" }}>{label}</span>
                    <span className="font-semibold" style={{ color }}>{value}</span>
                  </div>
                ))}
                <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(92,58,138,0.3)", border: "1px solid rgba(196,181,253,0.18)" }}>
                  <h4 className="font-bold font-headline text-white">Supabase Ready</h4>
                  <p style={{ color: "rgba(220,200,255,0.7)" }}>
                    This app matches the PostgreSQL schema in the Stitch backend document.
                  </p>
                  <div className="space-y-1 font-mono text-[10px] pt-2" style={{ borderTop: "1px solid rgba(196,181,253,0.15)", color: "rgba(196,181,253,0.7)" }}>
                    {["Profiles Table linked", "Doctors Table configured", "Appointments Table aligned", "Medical Records Table ready"].map(l => (
                      <p key={l}>✔ {l}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AIAgent role="admin" />
    </>
  );
}
