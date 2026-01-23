import { z } from 'zod';

// Auth Validators
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'STAFF']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Student Validators
export const studentSchema = z.object({
  admissionNo: z.string().min(1, 'Admission number is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().or(z.date()),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  nationality: z.string().default('Indian'),
  motherTongue: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().min(1, 'Section is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
  // Parent info
  fatherName: z.string().optional(),
  fatherPhone: z.string().optional(),
  fatherEmail: z.string().email().optional().or(z.literal('')),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherPhone: z.string().optional(),
  motherEmail: z.string().email().optional().or(z.literal('')),
  motherOccupation: z.string().optional(),
});

// Teacher Validators
export const teacherSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().or(z.date()),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  qualification: z.string().min(1, 'Qualification is required'),
  specialization: z.string().optional(),
  experience: z.number().int().min(0).default(0),
  departmentId: z.string().optional(),
  designation: z.string().optional(),
  basicSalary: z.number().positive('Salary must be positive'),
  joiningDate: z.string().or(z.date()).optional(),
});

// Class Validators
export const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  numericValue: z.number().int().positive(),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classTeacherId: z.string().optional(),
  roomNo: z.string().optional(),
  capacity: z.number().int().positive().default(40),
});

export const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  classId: z.string().min(1, 'Class is required'),
  roomNo: z.string().optional(),
  capacity: z.number().int().positive().default(40),
});

// Subject Validators
export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  classId: z.string().min(1, 'Class is required'),
  type: z.enum(['THEORY', 'PRACTICAL', 'BOTH']).default('THEORY'),
  isOptional: z.boolean().default(false),
});

// Exam Validators
export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classId: z.string().min(1, 'Class is required'),
  examType: z.enum(['UNIT_TEST', 'MID_TERM', 'FINAL', 'PRACTICAL', 'ASSIGNMENT']),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  maxMarks: z.number().int().positive().default(100),
  passingMarks: z.number().int().positive().default(33),
});

export const examResultSchema = z.object({
  examId: z.string().min(1, 'Exam is required'),
  studentId: z.string().min(1, 'Student is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  marksObtained: z.number().min(0),
  isAbsent: z.boolean().default(false),
  remarks: z.string().optional(),
});

// Fee Validators
export const feeStructureSchema = z.object({
  name: z.string().min(1, 'Fee name is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  classId: z.string().optional(),
  feeType: z.enum(['TUITION', 'ADMISSION', 'TRANSPORT', 'HOSTEL', 'LIBRARY', 'LABORATORY', 'SPORTS', 'EXAM', 'OTHER']),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.enum(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY']),
  dueDay: z.number().int().min(1).max(31).default(10),
  lateFee: z.number().min(0).default(0),
  isOptional: z.boolean().default(false),
});

export const feePaymentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  feeStructureId: z.string().min(1, 'Fee structure is required'),
  amount: z.number().positive('Amount must be positive'),
  discount: z.number().min(0).default(0),
  paymentMode: z.enum(['CASH', 'CARD', 'UPI', 'NET_BANKING', 'CHEQUE', 'DD']),
  forMonth: z.string().or(z.date()),
  remarks: z.string().optional(),
});

// Library Validators
export const bookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subject: z.string().optional(),
  language: z.string().default('English'),
  pages: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().positive().default(1),
  shelfLocation: z.string().optional(),
  description: z.string().optional(),
});

export const bookIssueSchema = z.object({
  bookId: z.string().min(1, 'Book is required'),
  studentId: z.string().min(1, 'Student is required'),
  dueDate: z.string().or(z.date()),
});

// Attendance Validators
export const attendanceSchema = z.object({
  date: z.string().or(z.date()),
  records: z.array(z.object({
    studentId: z.string().min(1),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE']),
    remarks: z.string().optional(),
  })),
});

// Leave Request Validators
export const leaveRequestSchema = z.object({
  leaveType: z.enum(['CASUAL', 'SICK', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID']),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  reason: z.string().min(10, 'Please provide a detailed reason'),
});

// Transport Validators
export const vehicleSchema = z.object({
  vehicleNo: z.string().min(1, 'Vehicle number is required'),
  vehicleType: z.enum(['BUS', 'VAN', 'AUTO', 'CAR']),
  capacity: z.number().int().positive(),
  driverName: z.string().min(1, 'Driver name is required'),
  driverPhone: z.string().min(10, 'Valid phone number required'),
  driverLicense: z.string().optional(),
  conductorName: z.string().optional(),
  conductorPhone: z.string().optional(),
});

export const routeSchema = z.object({
  name: z.string().min(1, 'Route name is required'),
  routeNo: z.string().min(1, 'Route number is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  startPoint: z.string().min(1, 'Start point is required'),
  endPoint: z.string().min(1, 'End point is required'),
  distance: z.number().positive().optional(),
});

// Hostel Validators
export const hostelBuildingSchema = z.object({
  name: z.string().min(1, 'Building name is required'),
  code: z.string().min(1, 'Code is required'),
  type: z.enum(['BOYS', 'GIRLS', 'STAFF']),
  wardenName: z.string().optional(),
  wardenPhone: z.string().optional(),
  capacity: z.number().int().positive(),
  address: z.string().optional(),
});

export const hostelRoomSchema = z.object({
  roomNo: z.string().min(1, 'Room number is required'),
  buildingId: z.string().min(1, 'Building is required'),
  floor: z.number().int().min(0),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY']),
  capacity: z.number().int().positive(),
  rentPerMonth: z.number().positive(),
  facilities: z.string().optional(),
});

// Notice Validators
export const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  type: z.enum(['GENERAL', 'ACADEMIC', 'EXAM', 'EVENT', 'HOLIDAY', 'EMERGENCY', 'FEE_REMINDER']),
  targetRoles: z.array(z.string()).min(1, 'Select at least one target'),
  targetClasses: z.array(z.string()).optional(),
  expiresAt: z.string().or(z.date()).optional(),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type TeacherInput = z.infer<typeof teacherSchema>;
export type ClassInput = z.infer<typeof classSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type ExamResultInput = z.infer<typeof examResultSchema>;
export type FeeStructureInput = z.infer<typeof feeStructureSchema>;
export type FeePaymentInput = z.infer<typeof feePaymentSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type BookIssueInput = z.infer<typeof bookIssueSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type RouteInput = z.infer<typeof routeSchema>;
export type HostelBuildingInput = z.infer<typeof hostelBuildingSchema>;
export type HostelRoomInput = z.infer<typeof hostelRoomSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
