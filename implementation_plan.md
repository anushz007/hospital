# Hospital Management System (MediFlow Health) Web Application

Implementation plan to build a fully functional, premium web application based on your Stitch project ID `4122668933013124099` (Clinical Precision design system).

The application will be developed using **Next.js 15 (App Router)** and **Tailwind CSS**. It will incorporate the exact styling, visual aesthetics, copy, and layout structures from the 9 screen templates retrieved from your Stitch design project. To make it instantly runnable and fully functional without requiring database credentials, we will implement a persistent local storage mock Supabase engine that can be easily connected to a real Supabase instance in the future.

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions:**
> 1. **Next.js 15 App Router + Tailwind CSS:** Set up inside the `hospital` directory.
> 2. **Local Storage Mock Database:** A mock database engine (`src/lib/db.ts`) simulating Supabase tables (`profiles`, `doctors`, `appointments`, `medical_records`) so all interactive actions (booking appointments, updating status, adding medical records, processing payments) persist locally on your computer.
> 3. **Design System Adherence:** Configured in `tailwind.config.ts` using the "Clinical Precision" palette (`#003063` primary, `#006c49` secondary, `#472a00` tertiary) and fonts (`Public Sans` & `Inter`).

---

## Open Questions

> [!NOTE]
> We will construct the app with mock authentication that allows you to log in as either a **Patient**, **Doctor**, or **Admin** with one click on the login screen to facilitate testing. Let us know if you would like us to configure real Supabase Auth credentials or Google OAuth settings right away.

---

## Proposed Changes

### 1. Bootstrap Next.js Project

#### [NEW] [npx create-next-app](file:///c:/Users/techm/Desktop/hospital)
Bootstrap a Next.js App Router project using TypeScript, ESLint, and Tailwind CSS.
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

### 2. Configure Design System

#### [MODIFY] [tailwind.config.ts](file:///c:/Users/techm/Desktop/hospital/src/tailwind.config.ts) (or tailwind.config.js)
Define colors, fonts, border radii, and custom spacing matching "Clinical Precision":
- **Primary:** `#003063` (Deep Blue)
- **Secondary:** `#006c49` (Medical Green)
- **Background/Surface:** `#f8f9ff`
- **Border Radius:** `rounded-md` (8px), `rounded-xl` (12px/16px)
- **Fonts:** Public Sans (Headings), Inter (Body)

#### [MODIFY] [src/app/globals.css](file:///c:/Users/techm/Desktop/hospital/src/app/globals.css)
Inject Google Fonts (Public Sans, Inter, Material Symbols Outlined) and define custom UI animations (shimmer, fadeInUp, role-pill).

### 3. Persistent Local Database Engine

#### [NEW] [src/lib/db.ts](file:///c:/Users/techm/Desktop/hospital/src/lib/db.ts)
A mock database library reading/writing to `localStorage` to support:
- `getDoctors()` / `searchDoctors(dept)`
- `getAppointments(userId, role)`
- `bookAppointment(patientId, doctorId, date, time, notes)`
- `updateAppointmentStatus(id, status)`
- `getMedicalRecords(userId, role)`
- `addMedicalRecord(patientId, doctorId, diagnosis, prescription)`
- `getProfile(userId)` / `updateProfile(userId, data)`
- Pre-loaded mock doctors (e.g. Dr. James Wilson, Dr. Sarah Smith) and mock appointments.

### 4. Create App Pages & Views

#### [NEW] [src/app/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/page.tsx)
The landing page and login system. Features role selection (Patient, Doctor, Admin) with full micro-interactions, email/password entry, and quick sign-in triggers.

#### [NEW] [src/app/patient/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/patient/page.tsx)
The Patient Dashboard. Shows active patient name, welcome banner, quick links, step counter progress bar, upcoming appointments with status badges, and recent medical updates.

#### [NEW] [src/app/patient/book/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/patient/book/page.tsx)
The Appointment Booking portal.
- **Step 1:** Select clinical department (Cardiology, Pediatrics, Emergency, etc.) with custom left borders.
- **Step 2:** Choose available doctors in that department.
- **Step 3:** Select a date, time slot, and enter medical notes.

#### [NEW] [src/app/patient/records/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/patient/records/page.tsx)
Access diagnostic history, prescriptions, and lab report downloads with high readability and doctor notes.

#### [NEW] [src/app/patient/payment/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/patient/payment/page.tsx)
Secure Payment screen. Features mock billing details, a credit card layout form, and success flow updates.

#### [NEW] [src/app/doctor/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/doctor/page.tsx)
Doctor Dashboard. View patient queues, change appointment status (Confirm, Cancel, Complete), and see basic analytics of patients checked.

#### [NEW] [src/app/doctor/records/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/doctor/records/page.tsx)
Form for doctors to add new medical records (diagnosis, prescription) for patients.

#### [NEW] [src/app/admin/page.tsx](file:///c:/Users/techm/Desktop/hospital/src/app/admin/page.tsx)
Admin Console. Displays global statistics (Total Appointments, Active Doctors, Revenue), active scheduler charts, and a user role manager.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no TypeScript compilation or configuration errors.

### Manual Verification
- Launch the development server (`npm run dev`).
- Open a browser subagent to test the login role selection.
- Verify patient journey (Department Selection -> Book Appointment -> View Appointment on Dashboard).
- Verify doctor dashboard journey (Confirm patient appointment, add prescription).
- Verify admin dashboard view (Inspect global counts updating dynamically).
