"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, Profile } from "../lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
  const [email, setEmail] = useState("patient.john@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setProfiles(db.getProfiles());
  }, []);

  const handleRoleChange = (newRole: "patient" | "doctor" | "admin") => {
    setRole(newRole);
    setError("");
    if (newRole === "patient") setEmail("patient.john@gmail.com");
    else if (newRole === "doctor") setEmail("dr.wilson@mediflow.com");
    else setEmail("admin.it@mediflow.org");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = db.getProfileByEmail(email);
    if (profile && profile.role === role) {
      db.setCurrentUser(profile);
      router.push(`/${role}`);
    } else {
      setError(`No active ${role} profile found with email ${email}`);
    }
  };

  const roleIcons: Record<string, string> = {
    patient: "personal_injury",
    doctor: "stethoscope",
    admin: "admin_panel_settings",
  };

  return (
    <>
      {/* Override body background for login page only */}
      <style>{`
        body { 
          background: linear-gradient(145deg, #1a0800 0%, #3d1200 28%, #7a2c00 60%, #b85535 85%, #CF6B3E 100%) !important;
          background-attachment: fixed !important;
        }
      `}</style>

      <div className="flex flex-col" style={{ minHeight: "100vh" }}>
        {/* Main split layout */}
        <div className="flex flex-col lg:flex-row flex-1" style={{ minHeight: "calc(100vh - 41px)" }}>

          {/* ── LEFT HERO PANEL ── */}
          <div
            className="hidden lg:flex flex-col justify-between p-12 xl:p-16 text-white relative overflow-hidden"
            style={{ flex: "0 0 50%" }}
          >
            {/* Decorative orbs */}
            <div
              className="float-orb absolute rounded-full pointer-events-none"
              style={{
                top: "12%", right: "5%",
                width: 280, height: 280,
                background: "radial-gradient(circle, rgba(232,130,74,0.35) 0%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
            <div
              className="float-orb-2 absolute rounded-full pointer-events-none"
              style={{
                bottom: "20%", right: "18%",
                width: 160, height: 160,
                background: "radial-gradient(circle, rgba(207,107,62,0.28) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                top: "-8%", left: "-12%",
                width: 420, height: 420,
                background: "radial-gradient(circle, rgba(122,44,0,0.55) 0%, transparent 65%)",
              }}
            />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: "22px" }}>
                  local_hospital
                </span>
              </div>
              <span className="font-headline text-xl font-bold tracking-tight">MediFlow Health</span>
            </div>

            {/* Headline + description */}
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "rgba(255,200,150,0.8)" }}>
                  Healthcare reimagined
                </p>
                <h1 className="font-headline font-bold leading-tight"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                  Precision care,<br />
                  <span style={{ color: "#F5A878" }}>simplified</span><br />
                  for everyone.
                </h1>
              </div>
              <p className="font-body text-base max-w-sm" style={{ color: "rgba(255,220,190,0.75)", lineHeight: 1.7 }}>
                Empowering medical professionals with intelligent workflows and patients with compassionate digital portals.
              </p>

              {/* Stats */}
              <div className="flex gap-8 pt-2">
                {[
                  { value: "50k+", label: "Patients served" },
                  { value: "1,200+", label: "Doctors onboard" },
                  { value: "99.9%", label: "Uptime SLA" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-headline text-2xl font-bold text-white">{s.value}</p>
                    <p className="font-label text-xs mt-0.5" style={{ color: "rgba(255,200,160,0.65)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div
              className="relative z-10 p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden border-2 flex items-center justify-center"
                  style={{ borderColor: "rgba(255,255,255,0.35)", background: "linear-gradient(135deg, #CF6B3E, #7a2c00)" }}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                </div>
                <div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,230,210,0.85)" }}>
                    &ldquo;MediFlow transformed how I manage patient care. Schedules, records, and billing — all seamless.&rdquo;
                  </p>
                  <p className="text-xs mt-2 font-semibold" style={{ color: "rgba(245,168,120,0.9)" }}>
                    Dr. Sarah M. — Cardiologist
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT FORM PANEL — Glassmorphic ── */}
          <div
            className="flex flex-col justify-center px-6 py-12 sm:px-12 xl:px-16 relative"
            style={{
              flex: "0 0 50%",
              background: "rgba(255, 245, 238, 0.10)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderLeft: "1px solid rgba(255, 200, 160, 0.15)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
            }}
          >
            {/* Subtle inner gradient overlay to lighten form area gently */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,240,225,0.18) 0%, rgba(255,255,255,0.22) 100%)",
                zIndex: 0,
              }}
            />
            {/* All form content sits above the overlay */}
            <div className="relative z-10 w-full">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-2 mb-10">
                <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: "30px" }}>
                  local_hospital
                </span>
                <span className="font-headline text-xl font-bold" style={{ color: "#fff" }}>MediFlow Health</span>
              </div>

              <div className="w-full max-w-[420px] mx-auto">
              <div className="mb-8 animate-fade-in-up">
                <h2 className="font-headline text-3xl font-bold mb-2" style={{ color: "#fff" }}>
                  Welcome back 👋
                </h2>
                <p className="font-body text-sm" style={{ color: "rgba(255,220,190,0.75)" }}>
                  Sign in to your healthcare portal to continue.
                </p>
              </div>

              {/* Role Selector */}
              <div className="mb-7 stagger-item" style={{ animationDelay: "0.1s" }}>
                <label
                  className="font-label text-xs font-semibold uppercase tracking-widest mb-2.5 block"
                  style={{ color: "rgba(255,200,160,0.7)" }}
                >
                  Access as
                </label>
                <div
                  className="flex items-center gap-1.5 p-1.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,200,160,0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {(["patient", "doctor", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className="flex-1 py-2 rounded-lg font-label text-sm transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95"
                      style={
                        role === r
                          ? {
                              background: "rgba(207,107,62,0.85)",
                              color: "#fff",
                              boxShadow: "0 4px 12px rgba(207,107,62,0.4)",
                              transform: "scale(1.02)",
                              backdropFilter: "blur(8px)",
                            }
                          : { color: "rgba(255,220,190,0.8)", background: "transparent" }
                      }
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "16px",
                          fontVariationSettings: role === r ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        {roleIcons[r]}
                      </span>
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="mb-5 p-3 rounded-lg text-sm font-label flex items-center gap-2"
                  style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5 stagger-item" style={{ animationDelay: "0.2s" }}>
                  <label className="font-label text-sm font-medium" style={{ color: "rgba(255,230,200,0.9)" }} htmlFor="email">
                    Email address
                  </label>
                  <div className="relative flex items-center">
                    <span
                      className="material-symbols-outlined absolute left-3.5 pointer-events-none"
                      style={{ fontSize: "20px", color: "rgba(255,180,130,0.7)" }}
                    >
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="login-input-orange w-full h-12 pl-11 pr-4 rounded-xl font-body text-sm"
                      style={{
                        color: "#1a0800",
                        background: "rgba(255,245,235,0.88)",
                        border: "1.5px solid rgba(255,180,130,0.4)",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5 stagger-item" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center justify-between">
                    <label className="font-label text-sm font-medium" style={{ color: "rgba(255,230,200,0.9)" }} htmlFor="password">
                      Password
                    </label>
                    <a href="#" className="font-label text-xs font-medium hover:underline" style={{ color: "#F5A878" }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <span
                      className="material-symbols-outlined absolute left-3.5 pointer-events-none"
                      style={{ fontSize: "20px", color: "rgba(255,180,130,0.7)" }}
                    >
                      lock
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input-orange w-full h-12 pl-11 pr-12 rounded-xl font-body text-sm"
                      style={{
                        color: "#1a0800",
                        background: "rgba(255,245,235,0.88)",
                        border: "1.5px solid rgba(255,180,130,0.4)",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 transition-colors"
                      style={{ color: "rgba(255,180,130,0.8)" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2 stagger-item" style={{ animationDelay: "0.35s" }}>
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#F5A878" }}
                  />
                  <label htmlFor="remember" className="font-label text-sm" style={{ color: "rgba(255,220,190,0.75)" }}>
                    Remember me for 30 days
                  </label>
                </div>

                {/* Sign In button — glassmorphic */}
                <button
                  type="submit"
                  className="stagger-item w-full h-[52px] rounded-xl font-label font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] relative overflow-hidden"
                  style={{
                    animationDelay: "0.4s",
                    background: "linear-gradient(135deg, rgba(207,107,62,0.92) 0%, rgba(122,44,0,0.88) 100%)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(245,168,120,0.45)",
                    boxShadow: "0 4px 20px rgba(207,107,62,0.40), inset 0 1px 0 rgba(255,200,160,0.25)",
                    color: "#fff",
                    letterSpacing: "0.02em",
                  }}
                >
                  {/* Inner shimmer line */}
                  <span
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,200,160,0.6), transparent)" }}
                  />
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                  Sign In to Portal
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6 stagger-item" style={{ animationDelay: "0.5s" }}>
                <div className="flex-grow border-t" style={{ borderColor: "rgba(255,200,160,0.2)" }} />
                <span className="px-4 font-label text-xs" style={{ color: "rgba(255,200,160,0.55)" }}>or continue with</span>
                <div className="flex-grow border-t" style={{ borderColor: "rgba(255,200,160,0.2)" }} />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleSubmit}
                className="stagger-item w-full h-12 rounded-xl font-label text-sm font-medium flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  animationDelay: "0.6s",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,200,160,0.25)",
                  color: "rgba(255,240,220,0.9)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.12)",
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>

              {/* Register */}
              <p
                className="mt-8 text-center font-body text-sm stagger-item"
                style={{ animationDelay: "0.7s", color: "rgba(255,210,180,0.65)" }}
              >
                New to MediFlow?{" "}
                <a href="#" className="font-semibold hover:underline" style={{ color: "#F5A878" }}>
                  Create an account
                </a>
              </p>
            </div>{/* end max-w-[420px] */}
          </div>{/* end z-10 w-full */}
        </div>{/* end right panel */}
      </div>{/* end flex row */}

      {/* Footer */}
      <footer
        className="py-3 px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-label"
        style={{
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(255,180,120,0.12)",
          color: "rgba(255,200,160,0.5)",
        }}
      >
        <p>© 2026 MediFlow Health Systems. All rights reserved.</p>
        <div className="flex gap-4">
          {["Privacy Policy", "Terms of Service", "Support"].map((link) => (
            <a key={link} href="#" className="hover:underline" style={{ color: "rgba(255,200,160,0.5)" }}>{link}</a>
          ))}
        </div>
      </footer>
    </div>{/* end root flex-col */}
  </>);
}
