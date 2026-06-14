"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Doctor, Appointment, Profile } from "../../../lib/db";
import AIAgent from "../../components/AIAgent";

const DEPARTMENTS = [
  { name: "Cardiology", description: "Heart & Vascular", color: "#F5A878", icon: "cardiology" },
  { name: "General Medicine", description: "Primary Care", color: "#6cf8bb", icon: "medical_services" },
  { name: "Pediatrics", description: "Children's Health", color: "#ffd700", icon: "child_care" },
  { name: "Neurology", description: "Brain & Nervous System", color: "#c4b5fd", icon: "psychology" },
  { name: "Orthopedics", description: "Bones & Joints", color: "#94a3b8", icon: "oncology" },
  { name: "Ophthalmology", description: "Eye Care", color: "#7dd3fc", icon: "visibility" },
  { name: "Dermatology", description: "Skin & Hair", color: "#f9a8d4", icon: "vaccines" },
  { name: "Emergency", description: "Critical Care", color: "#fca5a5", icon: "emergency", isEmergency: true },
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [step, setStep] = useState<"department" | "doctor" | "slot" | "success">("department");
  const [selectedDept, setSelectedDept] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-18");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [createdAppt, setCreatedAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") { router.push("/"); return; }
    setCurrentUser(user);
  }, [router]);

  const handleSelectDept = (deptName: string) => {
    setSelectedDept(deptName);
    setDoctors(db.searchDoctors(deptName));
    setStep("doctor");
  };
  const getSlotsForDoctor = (doc: Doctor) => {
    const allSlots: string[] = [];
    Object.keys(doc.availability).forEach(day => allSlots.push(...doc.availability[day]));
    return Array.from(new Set(allSlots));
  };
  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    const slots = getSlotsForDoctor(doc);
    if (slots.length > 0) setSelectedTime(slots[0]);
    setStep("slot");
  };
  const handleBook = () => {
    if (!currentUser || !selectedDoctor || !selectedDate || !selectedTime) return;
    const appt = db.bookAppointment(currentUser.id, selectedDoctor.id, selectedDate, selectedTime, notes);
    if (appt) { setCreatedAppt(appt); setStep("success"); }
  };
  const handleLogout = () => { db.logout(); router.push("/"); };
  if (!currentUser) return null;

  const filteredDepts = DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`body { background: linear-gradient(145deg,#1a0800 0%,#3d1200 28%,#7a2c00 60%,#b85535 85%,#CF6B3E 100%) fixed !important; }`}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-orb absolute rounded-full" style={{ top: "8%", right: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(232,130,74,0.2) 0%, transparent 70%)" }} />
        <div className="float-orb-2 absolute rounded-full" style={{ bottom: "18%", left: "5%", width: 220, height: 220, background: "radial-gradient(circle, rgba(207,107,62,0.15) 0%, transparent 70%)" }} />
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
                  { href: "/patient/book", label: "Schedule", active: true },
                  { href: "/patient/records", label: "Records", active: false },
                ].map(({ href, label, active }) => (
                  <Link key={href} href={href} className="font-label text-sm" style={{ color: active ? "#F5A878" : "rgba(255,220,190,0.7)", fontWeight: active ? 700 : 400 }}>{label}</Link>
                ))}
              </div>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-label"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,180,120,0.25)", color: "rgba(255,220,190,0.85)" }}>Sign Out</button>
              <div className="rounded-full overflow-hidden w-10 h-10 border-2" style={{ borderColor: "rgba(245,168,120,0.5)" }}>
                <img alt="User profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32">
          <div className="mb-8">
            <div className="flex items-center gap-1 font-label text-xs mb-2" style={{ color: "rgba(255,180,120,0.6)" }}>
              <Link href="/patient" style={{ color: "rgba(255,225,200,0.95)" }}>Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span style={{ color: "#F5A878", fontWeight: 600 }}>Book Appointment</span>
            </div>
            <h1 className="font-headline text-3xl font-bold text-white tracking-tight">Book an Appointment</h1>
            <p className="font-body text-sm mt-1" style={{ color: "rgba(255,225,200,0.95)" }}>
              {step === "department" && "Select a clinical department to see available specialists."}
              {step === "doctor" && `Choose a certified specialist in ${selectedDept}.`}
              {step === "slot" && "Select a convenient date and time for your appointment."}
              {step === "success" && "Your appointment has been successfully booked!"}
            </p>
          </div>

          {/* Department Step */}
          {step === "department" && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="relative w-full max-w-2xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(245,168,120,0.7)" }}>search</span>
                <input className="glass-input w-full h-[52px] pl-12 pr-4 rounded-xl font-body text-sm"
                  placeholder="Search departments or symptoms..." type="text"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="font-label text-xs self-center" style={{ color: "rgba(255,210,170,0.95)" }}>Popular:</span>
                  {["Fever", "Cardiology", "Pediatrics"].map(tag => (
                    <button key={tag} onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 rounded-full font-label text-xs transition-all hover:-translate-y-0.5"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,180,120,0.2)", color: "rgba(255,220,190,0.75)" }}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredDepts.map(dept => (
                  <div key={dept.name} onClick={() => handleSelectDept(dept.name)}
                    className="glass-card cursor-pointer p-6 rounded-xl flex flex-col items-center text-center hover:-translate-y-1 active:scale-95 transition-all"
                    style={{ borderLeft: `3px solid ${dept.color}40` }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: `${dept.color}18` }}>
                      <span className="material-symbols-outlined text-3xl" style={{ color: dept.color }}>{dept.icon}</span>
                    </div>
                    <h3 className="font-headline text-base font-semibold text-white mb-0.5">{dept.name}</h3>
                    <p className="font-label text-xs" style={{ color: "rgba(255,225,200,0.95)" }}>{dept.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Step */}
          {step === "doctor" && (
            <div className="space-y-6 animate-fade-in-up">
              <button onClick={() => setStep("department")} className="flex items-center gap-1 font-label text-sm hover:underline" style={{ color: "#F5A878" }}>
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Departments
              </button>
              <h3 className="font-headline text-2xl font-bold text-white">Available Doctors in {selectedDept}</h3>
              {doctors.length === 0 ? (
                <div className="glass-card p-10 rounded-xl text-center">
                  <span className="material-symbols-outlined text-[48px] mb-2" style={{ color: "rgba(255,180,120,0.4)" }}>person_off</span>
                  <p className="font-headline text-lg font-semibold text-white mb-1">No specialists online right now</p>
                  <p className="font-body text-sm" style={{ color: "rgba(255,225,200,0.95)" }}>Try Cardiology or Pediatrics.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {doctors.map(doc => (
                    <div key={doc.id} className="glass-card p-6 rounded-xl flex flex-col md:flex-row gap-5">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 flex-shrink-0 mx-auto md:mx-0" style={{ borderColor: "rgba(245,168,120,0.3)" }}>
                        <img alt={doc.full_name} className="w-full h-full object-cover" src={doc.avatar_url} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-headline text-lg font-bold text-white">{doc.full_name}</h4>
                        <p className="font-body text-sm font-semibold" style={{ color: "#F5A878" }}>{doc.specialization}</p>
                        <p className="font-body text-sm" style={{ color: "rgba(255,225,200,0.95)" }}>{doc.bio}</p>
                        <button onClick={() => handleSelectDoctor(doc)}
                          className="px-4 py-2 rounded-lg font-label text-sm text-white glass-btn-patient">
                          Select & Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Slot Step */}
          {step === "slot" && selectedDoctor && (
            <div className="space-y-6 animate-fade-in-up">
              <button onClick={() => setStep("doctor")} className="flex items-center gap-1 font-label text-sm hover:underline" style={{ color: "#F5A878" }}>
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Doctors
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 glass-card p-6 rounded-xl space-y-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 mx-auto" style={{ borderColor: "rgba(245,168,120,0.3)" }}>
                    <img alt={selectedDoctor.full_name} className="w-full h-full object-cover" src={selectedDoctor.avatar_url} />
                  </div>
                  <div className="text-center">
                    <h4 className="font-headline text-lg font-bold text-white">{selectedDoctor.full_name}</h4>
                    <p className="font-body text-xs font-semibold" style={{ color: "#F5A878" }}>{selectedDoctor.specialization}</p>
                    <p className="font-body text-xs mt-2" style={{ color: "rgba(255,225,200,0.95)" }}>{selectedDoctor.bio}</p>
                  </div>
                </div>
                <div className="lg:col-span-8 glass-card p-6 rounded-xl space-y-5">
                  <h3 className="font-headline text-xl font-bold text-white">Schedule Your Slot</h3>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold uppercase" style={{ color: "rgba(255,225,200,0.95)" }}>Appointment Date</label>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                      className="glass-input h-12 px-4 rounded-xl font-body text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold uppercase" style={{ color: "rgba(255,225,200,0.95)" }}>Available Time Slots</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {getSlotsForDoctor(selectedDoctor).map(slot => (
                        <button key={slot} type="button" onClick={() => setSelectedTime(slot)}
                          className="py-3 rounded-xl font-label text-sm transition-all"
                          style={selectedTime === slot
                            ? { background: "rgba(207,107,62,0.5)", color: "#fff", border: "1px solid rgba(245,168,120,0.5)" }
                            : { background: "rgba(255,255,255,0.06)", color: "rgba(255,200,160,0.75)", border: "1px solid rgba(255,180,120,0.15)" }}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold uppercase" style={{ color: "rgba(255,225,200,0.95)" }}>Symptoms / Notes (Optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      placeholder="Briefly describe your symptoms..."
                      className="glass-input p-3 rounded-xl font-body text-sm" />
                  </div>
                  <button type="button" onClick={handleBook}
                    className="w-full py-4 rounded-xl font-label text-sm font-bold text-white glass-btn-patient">
                    Confirm Appointment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && createdAppt && (
            <div className="max-w-md mx-auto glass-card p-8 rounded-2xl text-center space-y-6 mt-10 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(26,122,85,0.3)" }}>
                <span className="material-symbols-outlined text-[48px]" style={{ color: "#6cf8bb", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold text-white">Appointment Booked!</h2>
                <p className="font-body text-sm mt-2" style={{ color: "rgba(255,225,200,0.95)" }}>Your medical slot has been successfully scheduled.</p>
              </div>
              <div className="p-4 rounded-xl text-left space-y-2 text-sm font-body" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,180,120,0.12)" }}>
                {[["Doctor", createdAppt.doctor_name], ["Department", createdAppt.department], ["Date", createdAppt.appointment_date], ["Time", createdAppt.appointment_time]].map(([k, v]) => (
                  <p key={k} className="text-white"><span style={{ color: "rgba(255,225,200,0.95)" }}>{k}:</span> {v}</p>
                ))}
              </div>
              <Link href="/patient" className="block w-full py-3 rounded-xl font-label text-sm font-semibold text-white glass-btn-patient text-center">
                Return to Dashboard
              </Link>
            </div>
          )}
        </main>
      </div>
      <AIAgent role="patient" />
    </>
  );
}
