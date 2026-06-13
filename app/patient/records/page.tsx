"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, MedicalRecord, Profile } from "../../../lib/db";

export default function PatientRecordsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") {
      router.push("/");
      return;
    }
    setCurrentUser(user);
    setRecords(db.getMedicalRecords(user.id, "patient"));
  }, [router]);

  const handleLogout = () => {
    db.logout();
    router.push("/");
  };

  const filteredRecords = records.filter(
    (rec) =>
      rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.prescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="font-headline text-2xl font-bold text-primary">MediFlow Health</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 mr-6">
              <Link href="/patient" className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/patient/book" className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors">
                Schedule
              </Link>
              <Link href="/patient/records" className="font-label text-sm text-primary font-bold transition-colors">
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
              <img alt="User Profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-1 text-on-surface-variant font-label text-xs mb-2">
            <Link href="/patient" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Medical Records</span>
          </div>

          <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
            Your Medical Records
          </h1>
          <p className="text-on-surface-variant font-body text-sm mt-1">
            Access diagnostic history, prescriptions, and lab report downloads.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="relative w-full max-w-md mb-8">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            className="w-full h-[48px] pl-12 pr-4 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body text-on-surface outline-none"
            placeholder="Search records, diagnoses, or doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Records List */}
        <div className="space-y-6">
          {filteredRecords.length === 0 ? (
            <div className="p-10 rounded-xl bg-surface-container-lowest border border-outline-variant text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-2">
                folder_open
              </span>
              <p className="font-headline text-lg font-semibold mb-1">No medical records found</p>
              <p className="font-body text-sm text-on-surface-variant">
                If you had diagnostic scans or doctor checks recently, records will show up once finalized by practitioners.
              </p>
            </div>
          ) : (
            filteredRecords.map((rec) => {
              const formattedDate = new Date(rec.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              });

              return (
                <div
                  key={rec.id}
                  className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-3 gap-2">
                    <div>
                      <h3 className="font-headline text-lg font-bold text-primary">
                        {rec.diagnosis}
                      </h3>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">
                        Recorded on {formattedDate} by {rec.doctor_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-label text-on-surface-variant">
                        ID: {rec.id}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 space-y-3">
                      <div>
                        <h4 className="font-label text-xs font-bold text-outline uppercase tracking-wider">
                          Prescription / Treatment Plan
                        </h4>
                        <p className="font-body text-sm text-on-surface mt-1 whitespace-pre-line bg-surface p-4 rounded-lg border border-outline-variant leading-relaxed">
                          {rec.prescription}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col justify-end gap-3">
                      {rec.lab_results_url && (
                        <button
                          type="button"
                          onClick={() => alert("Downloading Lab Results PDF spec...")}
                          className="w-full py-2.5 bg-surface border border-outline-variant hover:bg-surface-variant text-on-surface-variant font-label text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          Download Lab Results
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full py-2.5 bg-primary text-on-primary hover:bg-primary-container transition-colors font-label text-xs rounded-lg flex items-center justify-center gap-2"
                      >
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
  );
}
