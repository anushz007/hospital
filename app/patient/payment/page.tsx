"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Profile } from "../../../lib/db";

export default function SecurePaymentPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  
  // Form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  // Flow state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "patient") {
      router.push("/");
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number: xxxx xxxx xxxx xxxx
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry: MM/YY
    const val = e.target.value.replace(/\D/g, "");
    let formatted = val;
    if (val.length > 2) {
      formatted = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setCardExpiry(formatted.substring(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCardCvv(val.substring(0, 4));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Clean up appointments or confirm billing if needed in the mock db
    }, 2000);
  };

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
              <Link href="/patient/records" className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors">
                Records
              </Link>
            </div>
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
            <span className="text-primary font-semibold">Secure Payment</span>
          </div>

          <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">
            Checkout &amp; Bill Payment
          </h1>
          <p className="text-on-surface-variant font-body text-sm mt-1">
            Complete your transaction to settle hospital invoices and checkups.
          </p>
        </div>

        {isSuccess ? (
          <div className="max-w-md mx-auto p-8 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-md text-center space-y-6 mt-10 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-green-50 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>

            <div>
              <h2 className="font-headline text-2xl font-bold text-primary">Payment Successful!</h2>
              <p className="font-body text-sm text-on-surface-variant mt-2">
                Thank you. Your transaction has been approved and bill settled.
              </p>
            </div>

            <div className="bg-surface-container p-4 rounded-lg text-left space-y-2 text-sm font-body border border-outline-variant">
              <p><strong>Receipt No:</strong> TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p><strong>Payer:</strong> {currentUser.full_name}</p>
              <p><strong>Amount Paid:</strong> $120.00</p>
              <p><strong>Gateway:</strong> MediFlow Payment Desk</p>
            </div>

            <Link
              href="/patient"
              className="block w-full py-3 bg-primary text-on-primary font-label text-sm font-semibold rounded-lg hover:bg-primary-container transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment form */}
            <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl space-y-6">
              <h3 className="font-headline text-xl font-bold text-primary">Card Details</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">
                    CARDHOLDER NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className="h-12 px-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label text-xs font-semibold text-on-surface-variant">
                    CARD NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4000 1234 5678 9010"
                    className="h-12 px-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">
                      EXPIRY DATE
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="h-12 px-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label text-xs font-semibold text-on-surface-variant">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className="h-12 px-4 rounded-lg border border-outline bg-transparent font-body text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-primary text-on-primary font-label text-sm font-bold rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  {isProcessing ? "Processing..." : "Pay Securely $120.00"}
                </button>
              </form>
            </div>

            {/* Bill Summary and Visual Card Display */}
            <div className="lg:col-span-5 space-y-6">
              {/* Virtual Credit Card */}
              <div className="relative w-full aspect-[1.586] rounded-2xl bg-gradient-to-tr from-[#001b3d] to-[#00468c] p-6 text-white flex flex-col justify-between shadow-lg overflow-hidden">
                {/* Chip and logo */}
                <div className="flex justify-between items-start">
                  <div className="w-10 h-8 rounded bg-yellow-400/80 backdrop-blur-sm opacity-80"></div>
                  <span className="font-headline text-lg font-bold italic tracking-wider">MediCard</span>
                </div>

                {/* Card Number */}
                <div className="font-mono text-xl md:text-2xl tracking-widest my-4">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>

                {/* Cardholder name and Expiry */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase font-label">Cardholder</p>
                    <p className="font-label text-sm font-semibold uppercase tracking-wide truncate max-w-[200px]">
                      {cardName || "John Doe"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase font-label">Expires</p>
                    <p className="font-label text-sm font-semibold">
                      {cardExpiry || "MM/YY"}
                    </p>
                  </div>
                </div>

                {/* Background decorative circles */}
                <div className="absolute right-[-10%] bottom-[-10%] w-32 h-32 rounded-full bg-white/5 blur-md"></div>
              </div>

              {/* Invoice Breakdown */}
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl space-y-4">
                <h4 className="font-headline text-lg font-bold text-primary">Invoice Summary</h4>
                
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>General Consultation Fee</span>
                    <span>$100.00</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Clinical Facility Charges</span>
                    <span>$20.00</span>
                  </div>
                  <div className="border-t border-outline-variant pt-2 flex justify-between font-bold text-on-surface">
                    <span>Total Amount</span>
                    <span>$120.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
