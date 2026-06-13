"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { db, Profile, Doctor } from "../../../lib/db";

function DoctorRecordsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "p1";
  const apptId = searchParams.get("apptId");

  const [doctorUser, setDoctorUser] = useState<Profile | null>(null);
  const [patientProfile, setPatientProfile] = useState<Profile | null>(null);
  
  // Form input states
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [labResultsUrl, setLabResultsUrl] = useState("https://lh3.googleusercontent.com/blood_panel_spec.pdf");
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "doctor") {
      router.push("/");
      return;
    }
    setDoctorUser(user);
    
    const patient = db.getProfile(patientId);
    if (patient) {
      setPatientProfile(patient);
    }
  }, [router, patientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorUser || !patientProfile) return;

    setIsSaving(true);
    setTimeout(() => {
      // Add record to DB
      db.addMedicalRecord(
        patientProfile.id,
        doctorUser.id,
        diagnosis,
        prescription,
        labResultsUrl
      );

      // Mark appointment completed if apptId is provided
      if (apptId) {
        db.updateAppointmentStatus(apptId, "completed");
      }

      setIsSaving(false);
      setSuccessMsg("Medical record saved successfully! Redirecting...");
      setTimeout(() => {
        router.push("/doctor");
      }, 1500);
    }, 1000);
  };

  if (!doctorUser || !patientProfile) return null;

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
              <Link href="/doctor" className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/doctor/records" className="font-label text-sm text-primary font-bold transition-colors">
                Write Diagnoses
              </Link>
            </div>
            <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-primary-container">
              <img alt="Doctor Avatar" className="w-full h-full object-cover" src={doctorUser.avatar_url} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[900px] mx-auto px-6 py-8 pb-32 space-y-6">
        <button
          onClick={() => router.push("/doctor")}
          className="flex items-center gap-1 text-primary hover:underline font-label text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Dashboard
        </button>

        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm space-y-6">
          <div className="border-b border-outline-variant pb-4">
            <h2 className="font-headline text-2xl font-bold text-primary">
              Write Diagnosis &amp; Prescription
            </h2>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              Active patient: <strong>{patientProfile.full_name}</strong> ({patientProfile.phone})
            </p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-lg bg-green-50 text-secondary border border-green-200 text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-label text-xs font-bold text-on-surface-variant">
                DIAGNOSIS SUMMARY
              </label>
              <input
                type="text"
                required
                className="h-12 px-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                placeholder="e.g. Mild Hypertension, General Viral Fever"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label text-xs font-bold text-on-surface-variant">
                PRESCRIPTION DETAILS &amp; MEDICAL ADVICE
              </label>
              <textarea
                required
                rows={6}
                className="p-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary leading-relaxed"
                placeholder="Write specific pill schedules, dosages, active advice..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label text-xs font-bold text-on-surface-variant">
                LAB REPORTS URL (OPTIONAL)
              </label>
              <input
                type="text"
                className="h-12 px-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                placeholder="e.g. Supabase storage lab-results link"
                value={labResultsUrl}
                onChange={(e) => setLabResultsUrl(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 bg-primary text-on-primary font-label text-sm font-bold rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {isSaving ? "Saving details..." : "Save Record &amp; Checkout Patient"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function DoctorRecordsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-body text-primary">Loading Patient Records Form...</div>}>
      <DoctorRecordsForm />
    </Suspense>
  );
}
