"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, Profile } from "../lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
  const [email, setEmail] = useState("patient.john@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Populate profiles list
    setProfiles(db.getProfiles());
  }, []);

  // Update email automatically when role is selected to ease testing
  const handleRoleChange = (newRole: "patient" | "doctor" | "admin") => {
    setRole(newRole);
    setError("");
    if (newRole === "patient") {
      setEmail("patient.john@gmail.com");
    } else if (newRole === "doctor") {
      setEmail("dr.wilson@mediflow.com");
    } else {
      setEmail("admin.it@mediflow.org");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In our mock engine, we check if the profile exists matching email & role
    const profile = db.getProfileByEmail(email);
    
    if (profile && profile.role === role) {
      db.setCurrentUser(profile);
      router.push(`/${role}`);
    } else {
      setError(`No active ${role} profile found with email ${email}`);
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-background font-body text-on-surface">
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-6 py-10 md:py-20">
        {/* Atmospheric Background Element */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-surface-container blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-surface-variant blur-[120px] opacity-40"></div>
        </div>

        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Side: Branding and Hero */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-6 pr-10 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>
                local_hospital
              </span>
              <h1 className="font-headline text-[32px] font-bold text-primary tracking-tight">
                MediFlow Health
              </h1>
            </div>
            <h2 className="font-headline text-2xl font-semibold text-on-surface">
              Precision Healthcare <br />
              <span className="text-secondary">Management Simplified.</span>
            </h2>
            <p className="font-body text-lg text-on-surface-variant max-w-md">
              Empowering medical professionals with intelligent workflows and patients with compassionate digital care portals. Sign in to access your specialized dashboard.
            </p>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-outline-variant transition-transform duration-500 hover:scale-[1.02]">
              <img
                alt="Modern Hospital Infrastructure"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKCcBxTipVm8aRvZlfXr122aoqenRTa5xYBJqQb3zp92mejjneAZ_rrPlav59BMl9lnHDD6ohXkr5w3BHOcVkiVdqXcxbeYy6XUElXtwVnDPlBbnzJAFssOI96R2X_VwGUlLJf7rRaoDaXs-2OWGsGVC8JDoCMwVq7Pmx69KEGQhMlk9OFwpETOP-6HA0a0Di5DCx5nTwySWXAC9A6WIaw9wgsIETQjtsRT-KzFj2RCmCxvwnF4BYh02zf8-IL2VUWDbyZT8ZU7qI"
              />
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="login-card w-full max-w-[480px] p-8 md:p-10 rounded-xl border border-outline-variant shadow-lg flex flex-col animate-fade-in-up">
              {/* Mobile Branding */}
              <div className="lg:hidden flex flex-col items-center mb-6">
                <span className="material-symbols-outlined text-primary text-[40px] mb-2">
                  local_hospital
                </span>
                <h1 className="font-headline text-2xl text-primary font-bold">
                  MediFlow Health
                </h1>
              </div>

              <div className="text-center lg:text-left mb-8 stagger-item" style={{ animationDelay: "0.1s" }}>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  Welcome Back
                </h3>
                <p className="font-body text-on-surface-variant">
                  Please select your role and sign in to continue.
                </p>
              </div>

              {/* Role Selector (Segmented Control) */}
              <div className="mb-8 stagger-item" style={{ animationDelay: "0.2s" }}>
                <label className="font-label text-xs font-semibold text-outline mb-2 block tracking-wider uppercase">
                  SELECT YOUR ROLE
                </label>
                <div className="bg-surface-container-low p-1.5 rounded-lg flex items-center gap-1 border border-outline-variant">
                  <button
                    type="button"
                    className={`role-btn flex-1 py-2 rounded-md font-label text-sm transition-all duration-300 active:scale-95 ${
                      role === "patient"
                        ? "role-pill-active font-semibold"
                        : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => handleRoleChange("patient")}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    className={`role-btn flex-1 py-2 rounded-md font-label text-sm transition-all duration-300 active:scale-95 ${
                      role === "doctor"
                        ? "role-pill-active font-semibold"
                        : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => handleRoleChange("doctor")}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    className={`role-btn flex-1 py-2 rounded-md font-label text-sm transition-all duration-300 active:scale-95 ${
                      role === "admin"
                        ? "role-pill-active font-semibold"
                        : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => handleRoleChange("admin")}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded bg-error-container text-on-error-container text-sm font-label flex items-center gap-2 border border-error/20">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2 stagger-item" style={{ animationDelay: "0.3s" }}>
                  <label className="font-label text-xs font-semibold text-on-surface-variant transition-colors" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative flex items-center group">
                    <span className="material-symbols-outlined absolute left-4 text-outline transition-colors group-focus-within:text-primary">
                      mail
                    </span>
                    <input
                      className="w-full h-[52px] pl-12 pr-4 rounded-lg border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 bg-transparent font-body transition-all duration-300 outline-none text-on-surface"
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        role === "doctor"
                          ? "dr.wilson@mediflow.com"
                          : role === "patient"
                          ? "patient.john@gmail.com"
                          : "admin.it@mediflow.org"
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 stagger-item" style={{ animationDelay: "0.4s" }}>
                  <label className="font-label text-xs font-semibold text-on-surface-variant transition-colors" htmlFor="password">
                    Password
                  </label>
                  <div className="relative flex items-center group">
                    <span className="material-symbols-outlined absolute left-4 text-outline transition-colors group-focus-within:text-primary">
                      lock
                    </span>
                    <input
                      className="w-full h-[52px] pl-12 pr-12 rounded-lg border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 bg-transparent font-body transition-all duration-300 outline-none text-on-surface"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-4 text-outline hover:text-on-surface transition-colors"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <a className="font-label text-xs text-primary hover:underline transition-all" href="#">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  className="w-full h-[52px] bg-primary text-on-primary rounded-lg font-label font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98] duration-300 flex items-center justify-center gap-2 btn-shimmer stagger-item overflow-hidden relative"
                  style={{ animationDelay: "0.5s" }}
                  type="submit"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Sign In to Portal
                    <span className="material-symbols-outlined animate-pulse">login</span>
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6 stagger-item" style={{ animationDelay: "0.6s" }}>
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="px-4 font-label text-xs text-outline">OR</span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-[52px] bg-surface-bright border border-outline-variant text-on-surface-variant rounded-lg font-label font-semibold flex items-center justify-center gap-3 hover:bg-surface-container-high hover:-translate-y-0.5 hover:shadow-sm transition-all active:scale-[0.98] stagger-item"
                style={{ animationDelay: "0.7s" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Sign in with Google
              </button>

              <div className="mt-6 text-center stagger-item" style={{ animationDelay: "0.8s" }}>
                <p className="font-body text-sm text-on-surface-variant">
                  New to MediFlow?{" "}
                  <a className="text-primary font-bold hover:underline transition-all" href="#">
                    Create an account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer for Transactional Page */}
      <footer className="py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-2 border-t border-outline-variant bg-surface">
        <p className="font-label text-xs text-outline">
          © 2026 MediFlow Health Systems. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a className="font-label text-xs text-outline hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="font-label text-xs text-outline hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="font-label text-xs text-outline hover:text-primary transition-colors" href="#">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
