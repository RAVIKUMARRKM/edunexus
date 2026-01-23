import { z } from 'zod';

export const teacherFormSchema = z.object({
  // User fields
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),

  // Personal details
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  phone: z.string().optional(),
  photo: z.string().optional(),

  // Contact details
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  emergencyContact: z.string().optional(),

  // Professional details
  qualification: z.string().min(2, 'Qualification is required'),
  specialization: z.string().optional(),
  experience: z.coerce.number().min(0).default(0),
  joiningDate: z.string().optional(),
  departmentId: z.string().optional(),
  designation: z.string().optional(),
  basicSalary: z.coerce.number().min(0, 'Basic salary must be positive'),

  // Status
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED']).default('ACTIVE'),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;

export const attendanceFormSchema = z.object({
  date: z.string(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE']),
  inTime: z.string().optional(),
  outTime: z.string().optional(),
  remarks: z.string().optional(),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;
