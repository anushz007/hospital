"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Doctor, Appointment, Profile } from "../../../lib/db";

const DEPARTMENTS = [
  {
    name: "Cardiology",
    description: "Heart & Vascular",
    color: "#3B82F6",
    icon: "cardiology",
    bgClass: "bg-blue-50"
  },
  {
    name: "General Medicine",
    description: "Primary Care",
    color: "#10B981",
    icon: "medical_services",
    bgClass: "bg-green-50"
  },
  {
    name: "Pediatrics",
    description: "Children's Health",
    color: "#F59E0B",
    icon: "child_care",
    bgClass: "bg-amber-50"
  },
  {
    name: "Neurology",
    description: "Brain & Nervous System",
    color: "#8B5CF6",
    icon: "psychology",
    bgClass: "bg-purple-50"
  },
  {
    name: "Orthopedics",
    description: "Bones & Joints",
    color: "#64748B",
    icon: "oncology",
    bgClass: "bg-slate-50"
  },
  {
    name: "Ophthalmology",
    description: "Eye Care",
    color: "#0EA5E9",
    icon: "visibility",
    bgClass: "bg-sky-50"
  },
  {
    name: "Dermatology",
    description: "Skin & Hair",
    color: "#EC4899",
    icon: "vaccines",
    bgClass: "bg-pink-50"
  },
  {
    name: "Emergency",
    description: "Critical Care",
    color: "#ba1a1a",
    icon: "emergency",
    bgClass: "bg-red-50",
    isEmergency: true
  }
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  
  // Wizard state
  const [step, setStep] = useState<"department" | "doctor" | "slot" | "success">("department");
  const [selectedDept, setSelectedDept] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-18");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [createdAppt, setCreatedAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") {
      router.push("/");
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const handleSelectDept = (deptName: string) => {
    setSelectedDept(deptName);
    const filteredDocs = db.searchDoctors(deptName);
    setDoctors(filteredDocs);
    setStep("doctor");
  };

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    // Auto-select first slot
    const slots = getSlotsForDoctor(doc);
    if (slots.length > 0) {
      setSelectedTime(slots[0]);
    }
    setStep("slot");
  };

  const handleBook = () => {
    if (!currentUser || !selectedDoctor || !selectedDate || !selectedTime) return;
    const appt = db.bookAppointment(
      currentUser.id,
      selectedDoctor.id,
      selectedDate,
      selectedTime,
      notes
    );
    if (appt) {
      setCreatedAppt(appt);
      setStep("success");
    }
  };

  const getSlotsForDoctor = (doc: Doctor) => {
    // Return all availability slots as a simple array
    const allSlots: string[] = [];
    Object.keys(doc.availability).forEach(day => {
      allSlots.push(...doc.availability[day]);
    });
    return Array.from(new Set(allSlots)); // Unique
  };

  const handleLogout = () => {
    db.logout();
    router.push("/");
  };

  if (!currentUser) return null;

  const filteredDepts = DEPARTMENTS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
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
              <Link href="/patient/book" className="font-label text-sm text-primary font-bold transition-colors">
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
              <img alt="User profile avatar" className="w-full h-full object-cover" src={currentUser.avatar_url} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-1 text-on-surface-variant font-label text-xs mb-2">
            <Link href="/patient" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold">Select Department</span>
          </div>

          <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
            Book an Appointment
          </h1>
          <p className="text-on-surface-variant font-body text-sm mt-1">
            {step === "department" && "Select a clinical department to see available specialists."}
            {step === "doctor" && `Choose from our certified specialists in ${selectedDept}.`}
            {step === "slot" && `Select a convenient date and time slot for your appointment.`}
            {step === "success" && "Your appointment has been successfully booked!"}
          </p>
        </div>

        {/* Wizard Step Content */}

        {step === "department" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Search Bar Section */}
            <div className="relative w-full max-w-2xl">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline">search</span>
                <input
                  className="w-full h-[52px] pl-12 pr-24 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body text-on-surface placeholder:text-outline outline-none"
                  placeholder="Search departments, symptoms, or doctors..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-on-surface-variant font-label text-xs self-center mr-2">Popular:</span>
                <button
                  onClick={() => setSearchQuery("Fever")}
                  className="px-3 py-1 rounded-full border border-outline-variant text-on-surface-variant font-label text-xs hover:bg-surface-variant transition-colors"
                >
                  Fever
                </button>
                <button
                  onClick={() => setSearchQuery("Cardiology")}
                  className="px-3 py-1 rounded-full border border-outline-variant text-on-surface-variant font-label text-xs hover:bg-surface-variant transition-colors"
                >
                  Cardiology
                </button>
                <button
                  onClick={() => setSearchQuery("Pediatrics")}
                  className="px-3 py-1 rounded-full border border-outline-variant text-on-surface-variant font-label text-xs hover:bg-surface-variant transition-colors"
                >
                  Pediatrics
                </button>
              </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDepts.map((dept) => (
                <div
                  key={dept.name}
                  onClick={() => handleSelectDept(dept.name)}
                  className={`dept-card cursor-pointer bg-surface-bright border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95 border-l-4`}
                  style={{ borderLeftColor: dept.color }}
                >
                  <div className={`w-16 h-16 rounded-full ${dept.bgClass} flex items-center justify-center mb-4 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: dept.color }}>
                      {dept.icon}
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-semibold text-primary mb-1">{dept.name}</h3>
                  <p className="font-label text-xs text-on-surface-variant">{dept.description}</p>
                </div>
              ))}
            </div>

            {/* Promotion Section (Bento Style) */}
            <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden rounded-xl bg-primary h-48 md:h-64 flex flex-col justify-end p-6 group cursor-pointer">
                <div
                  className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80')"
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <div className="relative z-20">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label text-xs mb-2 inline-block">
                    New Feature
                  </span>
                  <h2 className="text-white font-headline text-xl font-bold">Telehealth Consultations</h2>
                  <p className="text-white/80 font-body text-sm max-w-xs mt-1">
                    Speak with our top specialists from the comfort of your home.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-surface-container p-6 flex flex-col justify-between border border-outline-variant">
                <div>
                  <h2 className="text-primary font-headline text-xl font-bold mb-2">Need Help Choosing?</h2>
                  <p className="text-on-surface-variant font-body text-sm">
                    Our AI-assisted symptom checker can help guide you to the right department in under 2 minutes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery("General")}
                  className="mt-6 w-full py-3 bg-surface-bright border border-primary text-primary font-label text-sm font-semibold rounded-xl hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">bolt</span>
                  Start Symptom Assessment
                </button>
              </div>
            </section>
          </div>
        )}

        {step === "doctor" && (
          <div className="space-y-6 animate-fade-in-up">
            <button
              onClick={() => setStep("department")}
              className="flex items-center gap-1 text-primary hover:underline font-label text-sm mb-4"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Departments
            </button>

            <h3 className="font-headline text-2xl font-bold text-primary mb-4">
              Available Doctors in {selectedDept}
            </h3>

            {doctors.length === 0 ? (
              <div className="p-10 rounded-xl bg-surface-container-lowest border border-outline-variant text-center">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">
                  person_off
                </span>
                <p className="font-headline text-lg font-semibold mb-1">No specialists online right now</p>
                <p className="font-body text-sm text-on-surface-variant">
                  We are setting up doctor listings for this department. Try Cardiology or Pediatrics.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 mx-auto md:mx-0">
                      <img alt={doc.full_name} className="w-full h-full object-cover" src={doc.avatar_url} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-headline text-xl font-bold text-on-surface">{doc.full_name}</h4>
                        <p className="font-body text-sm text-primary font-semibold">{doc.specialization}</p>
                      </div>
                      <p className="font-body text-sm text-on-surface-variant">{doc.bio}</p>
                      <button
                        onClick={() => handleSelectDoctor(doc)}
                        className="w-full md:w-auto px-4 py-2 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all"
                      >
                        Select & Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "slot" && selectedDoctor && (
          <div className="space-y-6 animate-fade-in-up">
            <button
              onClick={() => setStep("doctor")}
              className="flex items-center gap-1 text-primary hover:underline font-label text-sm mb-4"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Doctors
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Doctor Quick Details */}
              <div className="lg:col-span-4 p-6 bg-surface-container-low border border-outline-variant rounded-xl space-y-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-outline-variant mx-auto">
                  <img
                    alt={selectedDoctor.full_name}
                    className="w-full h-full object-cover"
                    src={selectedDoctor.avatar_url}
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-headline text-lg font-bold">{selectedDoctor.full_name}</h4>
                  <p className="font-body text-xs text-primary font-semibold">{selectedDoctor.specialization}</p>
                  <p className="font-body text-xs text-on-surface-variant mt-2">{selectedDoctor.bio}</p>
                </div>
              </div>

              {/* Booking Form (Right Column) */}
              <div className="lg:col-span-8 p-6 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-6">
                <h3 className="font-headline text-xl font-bold text-primary">Schedule Your Slot</h3>

                <div className="space-y-4">
                  {/* Date Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">
                      APPOINTMENT DATE
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="h-12 px-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                    />
                  </div>

                  {/* Availability Grid */}
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">
                      AVAILABLE TIME SLOTS
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {getSlotsForDoctor(selectedDoctor).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 rounded-lg font-label text-sm transition-all border text-center ${
                            selectedTime === slot
                              ? "bg-primary text-on-primary border-primary shadow-sm"
                              : "bg-transparent border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes Area */}
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">
                      SYMPTOMS / HEALTH NOTES (OPTIONAL)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Briefly describe your symptoms or reason for visit..."
                      rows={3}
                      className="p-3 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBook}
                  className="w-full py-4 bg-primary text-on-primary font-label text-sm font-bold rounded-lg hover:bg-primary-container transition-all duration-300"
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "success" && createdAppt && (
          <div className="max-w-md mx-auto p-8 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-md text-center space-y-6 mt-10 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-green-50 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>

            <div>
              <h2 className="font-headline text-2xl font-bold text-primary">Appointment Booked!</h2>
              <p className="font-body text-sm text-on-surface-variant mt-2">
                Your medical slot has been successfully scheduled.
              </p>
            </div>

            <div className="bg-surface-container p-4 rounded-lg text-left space-y-2 text-sm font-body border border-outline-variant">
              <p><strong>Doctor:</strong> {createdAppt.doctor_name}</p>
              <p><strong>Department:</strong> {createdAppt.department}</p>
              <p><strong>Date:</strong> {createdAppt.appointment_date}</p>
              <p><strong>Time:</strong> {createdAppt.appointment_time}</p>
              <p className="capitalize"><strong>Status:</strong> <span className="text-secondary font-bold">{createdAppt.status}</span></p>
            </div>

            <Link
              href="/patient"
              className="block w-full py-3 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg hover:bg-primary-container transition-all"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
