// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User & Auth Types
export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT'
  | 'STAFF'
  | 'ACCOUNTANT'
  | 'LIBRARIAN'
  | 'TRANSPORT_MANAGER'
  | 'HOSTEL_WARDEN';

// Student Types
export interface StudentBasic {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  class: string;
  section: string;
  rollNo?: string;
  photo?: string;
}

// Teacher Types
export interface TeacherBasic {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  designation?: string;
  department?: string;
  photo?: string;
}

// Class Types
export interface ClassBasic {
  id: string;
  name: string;
  sections: SectionBasic[];
}

export interface SectionBasic {
  id: string;
  name: string;
  studentCount: number;
}

// Attendance Types
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

// Fee Types
export type FeeType = 'TUITION' | 'ADMISSION' | 'TRANSPORT' | 'HOSTEL' | 'LIBRARY' | 'LABORATORY' | 'SPORTS' | 'EXAM' | 'OTHER';
export type PaymentMode = 'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'CHEQUE' | 'DD';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface FeePaymentSummary {
  studentId: string;
  studentName: string;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  lastPaymentDate?: string;
}

// Exam Types
export type ExamType = 'UNIT_TEST' | 'MID_TERM' | 'FINAL' | 'PRACTICAL' | 'ASSIGNMENT';

export interface ExamResultSummary {
  studentId: string;
  examId: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  todayAttendance: {
    present: number;
    absent: number;
    percentage: number;
  };
  feeCollection: {
    thisMonth: number;
    pending: number;
  };
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  userId?: string;
}

// Navigation Types for Mobile
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  roles: Role[];
  badge?: number;
}

// Form Types
export interface SelectOption {
  label: string;
  value: string;
}

// Table Types
export interface TableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  key: string;
  value: string | string[];
  operator?: 'eq' | 'ne' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
}
