// Local Storage Mock Database Engine

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  phone: string;
  avatar_url?: string;
}

export interface Doctor {
  id: string; // references Profile.id
  full_name: string; // Denormalized for convenience
  specialization: string;
  bio: string;
  availability: {
    [key: string]: string[]; // e.g., { 'Monday': ['09:00', '10:30', '14:00'] }
  };
  department: string;
  avatar_url?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  diagnosis: string;
  prescription: string;
  lab_results_url?: string;
  created_at: string;
}

// Preloaded mock data
const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'p1',
    full_name: 'Alex Johnson',
    email: 'patient.john@gmail.com',
    role: 'patient',
    phone: '+1 555-0199',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXk7bQqDbR53Vye_SlMDdrj5YuZ2Xcq2lLtggv62oyz9Bv_5D5_zM5UC3476ePcTHpwK_EjaZFvdD_lngSMtf9T7Qq344GonNv8Q-YQwAQd1KE1a1-myHoixW_dxgxgfL78PmeH282dyM4T0bHQvIk34rxb-Ev-xjZwGhDpFSyP83NuqUbhRb6uUqF_0j62Tc05X-3krDtG0zH2Jm4c9tKYPWMj3JcyLol_O3zmWqqZyfw0tG-CDzWuZS9S3rvpPQ-fdRHYwSSSig'
  },
  {
    id: 'd1',
    full_name: 'Dr. James Wilson',
    email: 'dr.wilson@mediflow.com',
    role: 'doctor',
    phone: '+1 555-0122',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXsGnN1nRh7QCsR1nYIQXSSkCPiqrtD3p-hHuFz3o_zrnTD_4yfMdXKO8OycCOViackEvqqQntuANalP6hPbXFALp_7MHWbf7U8WJFhXw3Ki3bznZhTlS3aEPeTEyMkOzvVtL67wiXSXpbmbe6zXosyN7gWdTcgmtarXDwcAuGTKq4v-FMmHja4MWsnc6VH3HXcIKJZ0-7AXXHLcoTvz6diqcLsRj_YgjMJEBPwZ2S7-jN-49U5yxM-83F4KHagsPM769wUw8HDGA'
  },
  {
    id: 'd2',
    full_name: 'Dr. Sarah Smith',
    email: 'dr.smith@mediflow.com',
    role: 'doctor',
    phone: '+1 555-0133',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn4StjyBnORaLXSA9zieAWIHGOR36FsspJvH0D0xy7YWji_N640hs__yoS7_wYSrrtSHCUazqmVdm9j0fIjkBbiw0zZbHMOC1XNy2Mj7thfN8f5DNmcnJMDAmOLHtLuff6ZYVq2Ty0br0uMXz-f21QPcZc_GZaj77ku-VEn5HbED9k4DQYOgfyfF7QpH-nsy7rMHmnZOyex6W5w3alTHdZszj6uPTeNpsrfDmfcRI1uu5qInSzQd3i2T7Amz_ucogygmBYWoCeVsA'
  },
  {
    id: 'a1',
    full_name: 'System Admin',
    email: 'admin.it@mediflow.org',
    role: 'admin',
    phone: '+1 555-0100',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_--wepguJlXD_YXIRwJidzbUIuYS6spEYZDiJ8uiX518bYiErB_2QLoEUd7zzxdkgX5XrZ_aK8JcnTi1Om5oZ4cNi1RFTHuoYpz_lRpz8FuXMoKOIlrVPV28xWb9FhINFGQUC0swpghnMEE2VIofUx-au4kQUUMZx0xOnJ5J22jhhlPMW4iveHwJm3HgDwsuqJ5iIIl-AHWxtNckb2f4XNvUf6WXrWacPiinxKPxgsGa-LKJKcmUR6ybX1jjDRGh02Wx7Xe5HFak'
  }
];

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    full_name: 'Dr. James Wilson',
    specialization: 'Cardiology Specialist',
    bio: 'Experienced cardiologist specializing in cardiovascular health, heart failures, and preventive clinical care. Committed to compassionate patient health journeys.',
    availability: {
      'Monday': ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'],
      'Wednesday': ['09:00 AM', '10:00 AM', '11:30 AM', '01:30 PM', '04:00 PM'],
      'Friday': ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
    },
    department: 'Cardiology',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXsGnN1nRh7QCsR1nYIQXSSkCPiqrtD3p-hHuFz3o_zrnTD_4yfMdXKO8OycCOViackEvqqQntuANalP6hPbXFALp_7MHWbf7U8WJFhXw3Ki3bznZhTlS3aEPeTEyMkOzvVtL67wiXSXpbmbe6zXosyN7gWdTcgmtarXDwcAuGTKq4v-FMmHja4MWsnc6VH3HXcIKJZ0-7AXXHLcoTvz6diqcLsRj_YgjMJEBPwZ2S7-jN-49U5yxM-83F4KHagsPM769wUw8HDGA'
  },
  {
    id: 'd2',
    full_name: 'Dr. Sarah Smith',
    specialization: 'Pediatrics Lead',
    bio: 'Compassionate pediatric clinical lead focusing on developmental monitoring, immunizations, and preventive child healthcare. Friendly and patient-centered.',
    availability: {
      'Tuesday': ['10:00 AM', '11:00 AM', '01:15 PM', '02:15 PM', '03:30 PM'],
      'Thursday': ['09:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '04:15 PM']
    },
    department: 'Pediatrics',
    avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn4StjyBnORaLXSA9zieAWIHGOR36FsspJvH0D0xy7YWji_N640hs__yoS7_wYSrrtSHCUazqmVdm9j0fIjkBbiw0zZbHMOC1XNy2Mj7thfN8f5DNmcnJMDAmOLHtLuff6ZYVq2Ty0br0uMXz-f21QPcZc_GZaj77ku-VEn5HbED9k4DQYOgfyfF7QpH-nsy7rMHmnZOyex6W5w3alTHdZszj6uPTeNpsrfDmfcRI1uu5qInSzQd3i2T7Amz_ucogygmBYWoCeVsA'
  }
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt1',
    patient_id: 'p1',
    patient_name: 'Alex Johnson',
    doctor_id: 'd1',
    doctor_name: 'Dr. James Wilson',
    department: 'Cardiology',
    appointment_date: '2026-06-18',
    appointment_time: '10:30 AM',
    status: 'confirmed',
    notes: 'Routine cardiovascular checkup, follow-up on last blood panel test.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'appt2',
    patient_id: 'p1',
    patient_name: 'Alex Johnson',
    doctor_id: 'd2',
    doctor_name: 'Dr. Sarah Smith',
    department: 'Pediatrics',
    appointment_date: '2026-06-22',
    appointment_time: '02:15 PM',
    status: 'confirmed',
    notes: 'General follow-up visit and standard diagnostics check.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'mr1',
    patient_id: 'p1',
    patient_name: 'Alex Johnson',
    doctor_id: 'd1',
    doctor_name: 'Dr. James Wilson',
    diagnosis: 'Mild Hypertension (Well-Controlled)',
    prescription: 'Lipitor 10mg - once daily; Maintain low-sodium diet and log daily exercises.',
    lab_results_url: 'https://lh3.googleusercontent.com/blood_panel_spec.pdf',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to initialize and retrieve from LocalStorage
function getStoredData<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === 'undefined') return defaultData;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(item) as T[];
  } catch {
    return defaultData;
  }
}

function setStoredData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Database Operations
export const db = {
  // Profiles
  getProfiles: (): Profile[] => getStoredData('mf_profiles', DEFAULT_PROFILES),
  getProfile: (id: string): Profile | undefined => {
    return db.getProfiles().find(p => p.id === id);
  },
  getProfileByEmail: (email: string): Profile | undefined => {
    return db.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
  },

  // Doctors
  getDoctors: (): Doctor[] => getStoredData('mf_doctors', DEFAULT_DOCTORS),
  getDoctor: (id: string): Doctor | undefined => {
    return db.getDoctors().find(d => d.id === id);
  },
  searchDoctors: (department: string): Doctor[] => {
    const list = db.getDoctors();
    if (!department) return list;
    return list.filter(d => d.department.toLowerCase() === department.toLowerCase());
  },

  // Appointments
  getAppointments: (userId?: string, role?: 'patient' | 'doctor' | 'admin'): Appointment[] => {
    const appts = getStoredData('mf_appointments', DEFAULT_APPOINTMENTS);
    if (!userId || !role) return appts;
    if (role === 'patient') {
      return appts.filter(a => a.patient_id === userId);
    }
    if (role === 'doctor') {
      return appts.filter(a => a.doctor_id === userId);
    }
    return appts; // Admin sees all
  },
  bookAppointment: (
    patientId: string,
    doctorId: string,
    date: string,
    time: string,
    notes?: string
  ): Appointment | null => {
    const patient = db.getProfile(patientId);
    const doctor = db.getDoctor(doctorId);
    if (!patient || !doctor) return null;

    const newAppt: Appointment = {
      id: 'appt_' + Math.random().toString(36).substr(2, 9),
      patient_id: patientId,
      patient_name: patient.full_name,
      doctor_id: doctorId,
      doctor_name: doctor.full_name,
      department: doctor.department,
      appointment_date: date,
      appointment_time: time,
      status: 'pending',
      notes,
      created_at: new Date().toISOString()
    };

    const appts = db.getAppointments();
    appts.push(newAppt);
    setStoredData('mf_appointments', appts);
    return newAppt;
  },
  updateAppointmentStatus: (id: string, status: Appointment['status']): Appointment | null => {
    const appts = db.getAppointments();
    const idx = appts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    appts[idx].status = status;
    setStoredData('mf_appointments', appts);
    return appts[idx];
  },

  // Medical Records
  getMedicalRecords: (userId?: string, role?: 'patient' | 'doctor' | 'admin'): MedicalRecord[] => {
    const records = getStoredData('mf_medical_records', DEFAULT_MEDICAL_RECORDS);
    if (!userId || !role) return records;
    if (role === 'patient') {
      return records.filter(r => r.patient_id === userId);
    }
    if (role === 'doctor') {
      return records.filter(r => r.doctor_id === userId);
    }
    return records; // Admin sees all
  },
  addMedicalRecord: (
    patientId: string,
    doctorId: string,
    diagnosis: string,
    prescription: string,
    labResultsUrl?: string
  ): MedicalRecord | null => {
    const patient = db.getProfile(patientId);
    const doctor = db.getDoctor(doctorId);
    if (!patient || !doctor) return null;

    const newRecord: MedicalRecord = {
      id: 'rec_' + Math.random().toString(36).substr(2, 9),
      patient_id: patientId,
      patient_name: patient.full_name,
      doctor_id: doctorId,
      doctor_name: doctor.full_name,
      diagnosis,
      prescription,
      lab_results_url: labResultsUrl,
      created_at: new Date().toISOString()
    };

    const records = db.getMedicalRecords();
    records.push(newRecord);
    setStoredData('mf_medical_records', records);
    return newRecord;
  },

  // Mock Authentication State
  getCurrentUser: (): Profile | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('mf_current_user');
    if (!user) {
      // Auto login as patient for instant testing
      const defaultUser = DEFAULT_PROFILES[0];
      localStorage.setItem('mf_current_user', JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(user) as Profile;
    } catch {
      return null;
    }
  },
  setCurrentUser: (profile: Profile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('mf_current_user', JSON.stringify(profile));
  },
  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('mf_current_user');
  }
};
