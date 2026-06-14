"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { db, Profile } from "../../../lib/db";

function DoctorRecordsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "p1";
  const apptId = searchParams.get("apptId");

  const [doctorUser, setDoctorUser] = useState<Profile | null>(null);
  const [patientProfile, setPatientProfile] = useState<Profile | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [labResultsUrl, setLabResultsUrl] = useState("https://lh3.googleusercontent.com/blood_panel_spec.pdf");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "doctor") { router.push("/"); return; }
    setDoctorUser(user);
    const patient = db.getProfile(patientId);
    if (patient) setPatientProfile(patient);
  }, [router, patientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorUser || !patientProfile) return;
    setIsSaving(true);
    setTimeout(() => {
      db.addMedicalRecord(patientProfile.id, doctorUser.id, diagnosis, prescription, labResultsUrl);
      if (apptId) db.updateAppointmentStatus(apptId, "completed");
      setIsSaving(false);
      setSuccessMsg("Medical record saved successfully! Redirecting...");
      setTimeout(() => router.push("/doctor"), 1500);
    }, 1000);
  };

  if (!doctorUser || !patientProfile) return null;

  return (
    <>
      <style>{`body { background: linear-gradient(145deg,#001208 0%,#002818 28%,#004a2a 60%,#006a3a 85%,#1a7a55 100%) fixed !important; }`}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-orb absolute rounded-full" style={{ top: "8%", right: "10%", width: 280, height: 280, background: "radial-gradient(circle, rgba(26,180,100,0.16) 0%, transparent 70%)" }} />
        <div className="float-orb-2 absolute rounded-full" style={{ bottom: "12%", left: "5%", width: 200, height: 200, background: "radial-gradient(circle, rgba(0,122,70,0.13) 0%, transparent 70%)" }} />
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
                  { href: "/doctor", label: "Dashboard", active: false },
                  { href: "/doctor/records", label: "Write Diagnoses", active: true },
                ].map(({ href, label, active }) => (
                  <Link key={href} href={href} className="font-label text-sm"
                    style={{ color: active ? "#6cf8bb" : "rgba(200,240,220,0.65)", fontWeight: active ? 700 : 400 }}>{label}</Link>
                ))}
              </div>
              <div className="rounded-full overflow-hidden w-10 h-10 border-2" style={{ borderColor: "rgba(108,248,187,0.4)" }}>
                <img alt="Doctor Avatar" className="w-full h-full object-cover" src={doctorUser.avatar_url} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[900px] mx-auto px-6 py-8 pb-32 space-y-6 animate-fade-in-up">
          <button onClick={() => router.push("/doctor")}
            className="flex items-center gap-1 font-label text-sm hover:underline" style={{ color: "#6cf8bb" }}>
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Dashboard
          </button>

          <div className="glass-card-doctor p-6 rounded-2xl space-y-6">
            <div className="pb-4" style={{ borderBottom: "1px solid rgba(100,220,160,0.15)" }}>
              <h2 className="font-headline text-2xl font-bold text-white">Write Diagnosis & Prescription</h2>
              <p className="font-body text-xs mt-1" style={{ color: "rgba(210,245,225,0.95)" }}>
                Active patient: <strong className="text-white">{patientProfile.full_name}</strong> ({patientProfile.phone})
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2"
                style={{ background: "rgba(26,122,85,0.3)", border: "1px solid rgba(108,248,187,0.25)", color: "#6cf8bb" }}>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "DIAGNOSIS SUMMARY", value: diagnosis, setValue: setDiagnosis, placeholder: "e.g. Mild Hypertension, General Viral Fever", type: "input" },
                { label: "LAB REPORTS URL (OPTIONAL)", value: labResultsUrl, setValue: setLabResultsUrl, placeholder: "e.g. Supabase storage lab-results link", type: "input" },
              ].map(({ label, value, setValue, placeholder }) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className="font-label text-xs font-bold uppercase" style={{ color: "rgba(210,245,225,0.95)" }}>{label}</label>
                  <input type="text" required={label === "DIAGNOSIS SUMMARY"}
                    className="glass-input-doctor h-12 px-4 rounded-xl font-body text-sm w-full"
                    placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} />
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="font-label text-xs font-bold uppercase" style={{ color: "rgba(210,245,225,0.95)" }}>PRESCRIPTION DETAILS & MEDICAL ADVICE</label>
                <textarea required rows={6}
                  className="glass-input-doctor p-4 rounded-xl font-body text-sm leading-relaxed w-full"
                  placeholder="Write specific pill schedules, dosages, active advice..."
                  value={prescription} onChange={e => setPrescription(e.target.value)} />
              </div>

              <button type="submit" disabled={isSaving}
                className="w-full py-4 rounded-xl font-label text-sm font-bold text-white flex items-center justify-center gap-2 glass-btn-doctor">
                <span className="material-symbols-outlined text-[18px]">save</span>
                {isSaving ? "Saving details..." : "Save Record & Checkout Patient"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default function DoctorRecordsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-body text-white">Loading Patient Records Form...</div>}>
      <DoctorRecordsForm />
    </Suspense>
  );
}
