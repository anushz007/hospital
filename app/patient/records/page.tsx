"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, MedicalRecord, Profile } from "../../../lib/db";
import AIAgent from "../../components/AIAgent";

export default function PatientRecordsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") { router.push("/"); return; }
    setCurrentUser(user);
    setRecords(db.getMedicalRecords(user.id, "patient"));
  }, [router]);

  const handleLogout = () => { db.logout(); router.push("/"); };
  const filteredRecords = records.filter(rec =>
    rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.prescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) return null;

  return (
    <>
      <style>{`body { background: linear-gradient(145deg,#1a0800 0%,#3d1200 28%,#7a2c00 60%,#b85535 85%,#CF6B3E 100%) fixed !important; }`}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-orb absolute rounded-full" style={{ top: "10%", right: "8%", width: 300, height: 300, background: "radial-gradient(circle, rgba(232,130,74,0.2) 0%, transparent 70%)" }} />
        <div className="float-orb-2 absolute rounded-full" style={{ bottom: "15%", left: "3%", width: 220, height: 220, background: "radial-gradient(circle, rgba(207,107,62,0.16) 0%, transparent 70%)" }} />
      </div>

      <div className="min-h-screen font-body flex flex-col relative z-10">
        <header className="glass-nav w-full top-0 sticky z-50">
          <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1440px] mx-auto">
            <Link href="/patient" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: "#F5A878" }}>local_hospital</span>
              <span className="font-headline text-2xl font-bold text-white">MediFlow Health</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-6 mr-6">
                {[
                  { href: "/patient", label: "Home", active: false },
                  { href: "/patient/book", label: "Schedule", active: false },
                  { href: "/patient/records", label: "Records", active: true },
                ].map(({ href, label, active }) => (
                  <Link key={href} href={href} className="font-label text-sm transition-colors"
                    style={{ color: active ? "#F5A878" : "rgba(255,220,190,0.7)", fontWeight: active ? 700 : 400 }}>
                    {label}
                  </Link>
                ))}
              </div>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-label"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,180,120,0.25)", color: "rgba(255,220,190,0.85)" }}>
                Sign Out
              </button>
              <div className="rounded-full overflow-hidden w-10 h-10 border-2" style={{ borderColor: "rgba(245,168,120,0.5)" }}>
                <img alt="User Profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32 animate-fade-in-up">
          <div className="mb-8">
            <div className="flex items-center gap-1 font-label text-xs mb-2" style={{ color: "rgba(255,180,120,0.6)" }}>
              <Link href="/patient" className="hover:underline"             style={{ color: "rgba(255,225,200,0.95)" }}>Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span style={{ color: "#F5A878", fontWeight: 600 }}>Medical Records</span>
            </div>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-white">Your Medical Records</h1>
            <p className="font-body text-sm mt-1"             style={{ color: "rgba(255,225,200,0.95)" }}>
              Access diagnostic history, prescriptions, and lab report downloads.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-md mb-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(245,168,120,0.7)" }}>search</span>
            <input type="text" className="glass-input w-full h-[48px] pl-12 pr-4 rounded-xl font-body text-sm"
              placeholder="Search records, diagnoses, or doctors..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>

          <div className="space-y-5">
            {filteredRecords.length === 0 ? (
              <div className="glass-card p-10 rounded-xl text-center">
                <span className="material-symbols-outlined text-[48px] mb-2" style={{ color: "rgba(255,180,120,0.4)" }}>folder_open</span>
                <p className="font-headline text-lg font-semibold text-white mb-1">No medical records found</p>
                <p className="font-body text-sm" style={{ color: "rgba(255,225,200,0.95)" }}>
                  Records will appear once finalized by your practitioner.
                </p>
              </div>
            ) : (
              filteredRecords.map(rec => {
                const formattedDate = new Date(rec.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                return (
                  <div key={rec.id} className="glass-card p-6 rounded-xl space-y-4 hover:-translate-y-0.5 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2"
                      style={{ borderBottom: "1px solid rgba(255,180,120,0.12)" }}>
                      <div>
                        <h3 className="font-headline text-lg font-bold text-white">{rec.diagnosis}</h3>
                        <p className="font-body text-xs mt-0.5" style={{ color: "rgba(255,225,200,0.95)" }}>
                          Recorded on {formattedDate} by {rec.doctor_name}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-label"
                        style={{ background: "rgba(207,107,62,0.2)", color: "rgba(255,200,160,0.8)", border: "1px solid rgba(255,180,120,0.15)" }}>
                        ID: {rec.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8 space-y-3">
                        <h4 className="font-label text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,210,170,0.95)" }}>
                          Prescription / Treatment Plan
                        </h4>
                        <p className="font-body text-sm whitespace-pre-line p-4 rounded-lg leading-relaxed text-white"
                          style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,180,120,0.1)" }}>
                          {rec.prescription}
                        </p>
                      </div>
                      <div className="md:col-span-4 flex flex-col justify-end gap-3">
                        {rec.lab_results_url && (
                          <button type="button" onClick={() => alert("Downloading Lab Results...")}
                            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-label text-xs transition-all hover:-translate-y-0.5"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,180,120,0.2)", color: "rgba(255,220,190,0.85)" }}>
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Download Lab Results
                          </button>
                        )}
                        <button type="button" onClick={() => window.print()}
                          className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-label text-xs text-white glass-btn-patient">
                          <span className="material-symbols-outlined text-[18px]">print</span>
                          Print Record Sheet
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
      <AIAgent role="patient" />
    </>
  );
}
