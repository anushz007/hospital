"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Profile } from "../../../lib/db";

export default function SecurePaymentPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") { router.push("/"); return; }
    setCurrentUser(user);
  }, [router]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted.substring(0, 19));
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCardExpiry(val.length > 2 ? val.substring(0, 2) + "/" + val.substring(2, 4) : val);
  };
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 4));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setIsSuccess(true); }, 2000);
  };

  if (!currentUser) return null;

  return (
    <>
      <style>{`body { background: linear-gradient(145deg,#1a0800 0%,#3d1200 28%,#7a2c00 60%,#b85535 85%,#CF6B3E 100%) fixed !important; }`}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="float-orb absolute rounded-full" style={{ top: "5%", right: "10%", width: 280, height: 280, background: "radial-gradient(circle, rgba(232,130,74,0.2) 0%, transparent 70%)" }} />
        <div className="float-orb-2 absolute rounded-full" style={{ bottom: "10%", left: "4%", width: 200, height: 200, background: "radial-gradient(circle, rgba(207,107,62,0.16) 0%, transparent 70%)" }} />
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
                {["/patient", "/patient/book", "/patient/records"].map((href, i) => (
                  <Link key={href} href={href} className="font-label text-sm" style={{ color: "rgba(255,220,190,0.7)" }}>
                    {["Home", "Schedule", "Records"][i]}
                  </Link>
                ))}
              </div>
              <div className="rounded-full overflow-hidden w-10 h-10 border-2" style={{ borderColor: "rgba(245,168,120,0.5)" }}>
                <img alt="User Profile" className="w-full h-full object-cover" src={currentUser.avatar_url} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8 pb-32">
          <div className="mb-8">
            <div className="flex items-center gap-1 font-label text-xs mb-2" style={{ color: "rgba(255,180,120,0.6)" }}>
              <Link href="/patient" style={{ color: "rgba(255,200,160,0.7)" }}>Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span style={{ color: "#F5A878", fontWeight: 600 }}>Secure Payment</span>
            </div>
            <h1 className="font-headline text-3xl font-bold text-white tracking-tight">Checkout & Bill Payment</h1>
            <p className="font-body text-sm mt-1" style={{ color: "rgba(255,200,160,0.7)" }}>Complete your transaction to settle hospital invoices.</p>
          </div>

          {isSuccess ? (
            <div className="max-w-md mx-auto glass-card p-8 rounded-2xl text-center space-y-6 mt-10 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(26,122,85,0.3)" }}>
                <span className="material-symbols-outlined text-[48px]" style={{ color: "#6cf8bb", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold text-white">Payment Successful!</h2>
                <p className="font-body text-sm mt-2" style={{ color: "rgba(255,200,160,0.7)" }}>Your transaction has been approved and bill settled.</p>
              </div>
              <div className="p-4 rounded-xl text-left space-y-2 text-sm font-body" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,180,120,0.12)" }}>
                <p className="text-white"><span style={{ color: "rgba(255,200,160,0.65)" }}>Receipt No:</span> TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p className="text-white"><span style={{ color: "rgba(255,200,160,0.65)" }}>Payer:</span> {currentUser.full_name}</p>
                <p className="text-white"><span style={{ color: "rgba(255,200,160,0.65)" }}>Amount Paid:</span> $120.00</p>
                <p className="text-white"><span style={{ color: "rgba(255,200,160,0.65)" }}>Gateway:</span> MediFlow Payment Desk</p>
              </div>
              <Link href="/patient" className="block w-full py-3 rounded-xl font-label text-sm font-semibold text-white glass-btn-patient text-center">
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Payment Form */}
              <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-2xl space-y-6">
                <h3 className="font-headline text-xl font-bold text-white">Card Details</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "CARDHOLDER NAME", value: cardName, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCardName(e.target.value), placeholder: "John Doe", type: "text" },
                    { label: "CARD NUMBER", value: cardNumber, onChange: handleCardNumberChange, placeholder: "4000 1234 5678 9010", type: "text" },
                  ].map(field => (
                    <div key={field.label} className="flex flex-col gap-2">
                      <label className="font-label text-xs font-semibold uppercase" style={{ color: "rgba(255,200,160,0.7)" }}>{field.label}</label>
                      <input type={field.type} required value={field.value} onChange={field.onChange} placeholder={field.placeholder}
                        className="glass-input h-12 px-4 rounded-xl font-body text-sm w-full" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-xs font-semibold uppercase" style={{ color: "rgba(255,200,160,0.7)" }}>EXPIRY DATE</label>
                      <input type="text" required value={cardExpiry} onChange={handleExpiryChange} placeholder="MM/YY"
                        className="glass-input h-12 px-4 rounded-xl font-body text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-xs font-semibold uppercase" style={{ color: "rgba(255,200,160,0.7)" }}>CVV / CVC</label>
                      <input type="password" required value={cardCvv} onChange={handleCvvChange} placeholder="•••"
                        className="glass-input h-12 px-4 rounded-xl font-body text-sm" />
                    </div>
                  </div>
                  <button type="submit" disabled={isProcessing}
                    className="w-full py-4 rounded-xl font-label text-sm font-bold text-white flex items-center justify-center gap-2 glass-btn-patient">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    {isProcessing ? "Processing..." : "Pay Securely $120.00"}
                  </button>
                </form>
              </div>

              {/* Card Visual + Invoice */}
              <div className="lg:col-span-5 space-y-6">
                {/* Virtual Credit Card */}
                <div className="relative w-full aspect-[1.586] rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xl overflow-hidden"
                  style={{ background: "linear-gradient(135deg, rgba(26,8,0,0.9) 0%, rgba(122,44,0,0.8) 60%, rgba(207,107,62,0.7) 100%)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,180,120,0.25)" }}>
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-8 rounded opacity-80" style={{ background: "linear-gradient(135deg, #F5A878, #CF6B3E)" }} />
                    <span className="font-headline text-lg font-bold italic tracking-wider" style={{ color: "rgba(255,220,190,0.9)" }}>MediCard</span>
                  </div>
                  <div className="font-mono text-xl md:text-2xl tracking-widest my-4 text-white">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-label" style={{ color: "rgba(255,200,160,0.6)" }}>Cardholder</p>
                      <p className="font-label text-sm font-semibold uppercase tracking-wide truncate max-w-[180px]">{cardName || "John Doe"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-label" style={{ color: "rgba(255,200,160,0.6)" }}>Expires</p>
                      <p className="font-label text-sm font-semibold">{cardExpiry || "MM/YY"}</p>
                    </div>
                  </div>
                  <div className="absolute right-[-10%] bottom-[-10%] w-32 h-32 rounded-full" style={{ background: "rgba(255,180,120,0.06)" }} />
                </div>

                {/* Invoice */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h4 className="font-headline text-lg font-bold text-white">Invoice Summary</h4>
                  <div className="space-y-2 text-sm font-body">
                    {[
                      { label: "General Consultation Fee", amt: "$100.00" },
                      { label: "Clinical Facility Charges", amt: "$20.00" },
                    ].map(({ label, amt }) => (
                      <div key={label} className="flex justify-between" style={{ color: "rgba(255,200,160,0.7)" }}>
                        <span>{label}</span><span>{amt}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 text-white" style={{ borderTop: "1px solid rgba(255,180,120,0.15)" }}>
                      <span>Total Amount</span><span>$120.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
