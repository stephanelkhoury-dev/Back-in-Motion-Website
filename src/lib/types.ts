// ============================================
// Back in Motion - Core Type Definitions
// ============================================

// --- User & Auth ---
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'therapist' | 'dietitian' | 'trainer' | 'aesthetic_specialist' | 'electrologist' | 'receptionist' | 'client';

// Role hierarchy for permission checks
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 80,
  manager: 60,
  therapist: 40,
  dietitian: 40,
  trainer: 40,
  aesthetic_specialist: 40,
  electrologist: 40,
  receptionist: 30,
  client: 10,
};

export const STAFF_ROLES: UserRole[] = ['admin', 'manager', 'therapist', 'dietitian', 'trainer', 'aesthetic_specialist', 'electrologist', 'receptionist'];

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  timezone: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Client extends User {
  role: 'client';
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  emergencyContact?: string;
  medicalNotes?: string;
  activeSubscriptions: Subscription[];
}

// --- Services ---
export type ServiceCategory = 'physio' | 'dietitian' | 'aesthetic' | 'electrolysis' | 'gym';

export type PhysioSpecialty =
  | 'sports_rehab'
  | 'orthopedic_rehab'
  | 'rheumatology_rehab'
  | 'neurological_rehab'
  | 'pediatric_rehab'
  | 'geriatric_rehab'
  | 'respiratory_rehab'
  | 'post_pregnancy_rehab';

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  specialty?: PhysioSpecialty;
  description: string;
  shortDescription: string;
  duration: number; // minutes
  price: number;
  imageUrl?: string;
  isActive: boolean;
}

// --- Appointments ---
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  clientId: string;
  practitionerId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  roomId?: string;
  equipmentId?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// --- Packages & Subscriptions ---
export type PackageType = 'single' | 'bundle' | 'monthly' | 'hybrid';

export interface Package {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  type: PackageType;
  totalSessions: number;
  price: number;
  validityDays: number;
  includesECoach: boolean;
  features: string[];
  isPopular?: boolean;
}

export type SubscriptionStatus = 'active' | 'paused' | 'expired' | 'cancelled';

export interface Subscription {
  id: string;
  clientId: string;
  packageId: string;
  status: SubscriptionStatus;
  purchasedSessions: number;
  completedSessions: number;
  remainingSessions: number;
  expiredSessions: number;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

// --- Exercise System ---
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type MuscleGroup = 'upper_body' | 'lower_body' | 'core' | 'full_body' | 'flexibility' | 'balance' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  category: string;
  difficulty: DifficultyLevel;
  description: string;
  instructions: string[];
  precautions?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface ExerciseAssignment {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  reps: number;
  sets: number;
  holdTime?: number; // seconds
  restTime: number; // seconds
  duration?: number; // seconds
  frequencyPerWeek: number;
  notes?: string;
  painLimit?: string;
}

export interface WorkoutLog {
  id: string;
  assignmentId: string;
  completedAt: string;
  completedSets: number;
  completedReps: number[];
  duration: number;
  painLevel: number; // 0-10
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  notes?: string;
}

// --- Meal Plans ---
export interface MealPlan {
  id: string;
  clientId: string;
  dietitianId: string;
  name: string;
  dailyCalories: number;
  meals: Meal[];
  startDate: string;
  endDate: string;
}

export interface Meal {
  name: string;
  time: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// --- Body Measurements ---
export interface BodyMeasurement {
  id: string;
  clientId: string;
  date: string;
  weight?: number;
  height?: number;
  bmi?: number;
  bodyFat?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
}

// --- Reminders ---
export type ReminderType = 'appointment' | 'session_balance' | 'package_expiry' | 'follow_up' | 'exercise' | 'subscription_renewal';
export type ReminderChannel = 'push' | 'sms' | 'whatsapp' | 'email';

export interface Reminder {
  id: string;
  clientId: string;
  type: ReminderType;
  channel: ReminderChannel;
  message: string;
  scheduledAt: string;
  sentAt?: string;
  read: boolean;
}

// --- E-Coach ---
export type ECoachPlanType = 'monthly_only' | 'hybrid' | 'bundle_addon';

export interface ECoachConversation {
  id: string;
  clientId: string;
  messages: ECoachMessage[];
  createdAt: string;
}

export interface ECoachMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// --- Payments ---
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  description: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  paymentId: string;
  items: InvoiceItem[];
  total: number;
  issuedAt: string;
  paidAt?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// --- Treatment Notes ---
export interface TreatmentNote {
  id: string;
  appointmentId: string;
  practitionerId: string;
  clientId: string;
  content: string;
  painLevel?: number;
  mobilityScore?: number;
  recommendations?: string;
  createdAt: string;
}

// --- Team ---
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  imageUrl: string;
  specialties: string[];
  languages?: string[];
}

// --- Blog ---
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  category: string;
  publishedAt: string;
  tags: string[];
}

// --- FAQ ---
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// --- Testimonial ---
export interface Testimonial {
  id: string;
  clientName: string;
  service: string;
  content: string;
  rating: number;
  imageUrl?: string;
}
