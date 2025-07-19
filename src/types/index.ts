// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'instructor';
  createdAt: Date;
  updatedAt: Date;
}

// Swimmer types
export interface Swimmer {
  id: string;
  name: string;
  age: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Instructor types
export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialties?: string[];
  availability?: Availability[];
  createdAt: Date;
  updatedAt: Date;
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  instructorId: string;
  maxCapacity: number;
  currentEnrollment: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  startTime: Date;
  endTime: Date;
  recurring: boolean;
  recurringPattern?: RecurringPattern;
  exceptions?: LessonException[];
  createdAt: Date;
  updatedAt: Date;
}

// Class types
export interface Class {
  id: string;
  lessonId: string;
  instructorId: string;
  startTime: Date;
  endTime: Date;
  maxCapacity: number;
  currentEnrollment: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Enrollment types
export interface Enrollment {
  id: string;
  classId: string;
  swimmerId: string;
  status: 'enrolled' | 'waitlisted' | 'cancelled';
  enrolledAt: Date;
  updatedAt: Date;
}

// Waitlist types
export interface WaitlistEntry {
  id: string;
  lessonId: string;
  swimmerId: string;
  parentId: string;
  status: 'waiting' | 'notified' | 'enrolled' | 'cancelled';
  joinedAt: Date;
  updatedAt: Date;
}

// Availability types
export interface Availability {
  id: string;
  instructorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  createdAt: Date;
  updatedAt: Date;
}

// Recurring pattern types
export interface RecurringPattern {
  type: 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[]; // For weekly patterns
  dayOfMonth?: number; // For monthly patterns
  endDate?: Date;
}

// Exception types
export interface LessonException {
  id: string;
  lessonId: string;
  date: Date;
  type: 'cancelled' | 'rescheduled' | 'modified';
  reason?: string;
  newStartTime?: Date;
  newEndTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Content types
export interface ContentSection {
  id: string;
  title: string;
  content: string;
  section: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SwimmerFormData {
  name: string;
  age: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface LessonFormData {
  title: string;
  description?: string;
  instructorId: string;
  maxCapacity: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  startTime: Date;
  endTime: Date;
  recurring: boolean;
  recurringPattern?: RecurringPattern;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
}

// Utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: Status;
  error?: string;
}

// NextAuth types
import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface NextAuthConfig {
  providers: any[];
  callbacks: {
    jwt?: (token: JWT, user: User) => JWT;
    session?: (session: any, token: JWT) => any;
  };
  pages?: {
    signIn?: string;
    error?: string;
  };
} 