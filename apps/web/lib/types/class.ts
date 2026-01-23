// Type definitions for Class Management Module

export interface AcademicYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  numericValue: number;
  academicYearId: string;
  academicYear: AcademicYear;
  classTeacherId?: string | null;
  classTeacher?: Teacher | null;
  roomNo?: string | null;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  sections?: Section[];
  subjects?: Subject[];
  _count?: {
    students: number;
    sections: number;
    subjects: number;
  };
}

export interface Section {
  id: string;
  name: string;
  classId: string;
  class?: Class;
  roomNo?: string | null;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    students: number;
    timetableSlots: number;
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  class?: Class;
  type: 'THEORY' | 'PRACTICAL' | 'BOTH';
  isOptional: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignments?: SubjectAssignment[];
  _count?: {
    timetableSlots: number;
  };
}

export interface SubjectAssignment {
  id: string;
  subjectId: string;
  subject?: Subject;
  teacherId: string;
  teacher: Teacher;
  createdAt: Date;
}

export interface Teacher {
  id: string;
  employeeId: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone?: string | null;
  };
  firstName: string;
  lastName: string;
  qualification: string;
  specialization?: string | null;
  experience: number;
  joiningDate: Date;
  departmentId?: string | null;
  designation?: string | null;
  basicSalary: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';
}

export interface TimetableSlot {
  id: string;
  sectionId: string;
  section?: Section;
  subjectId: string;
  subject: Subject;
  teacherId: string;
  teacher: Teacher;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "09:45"
  roomNo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Form Data Types
export interface CreateClassData {
  name: string;
  numericValue: number;
  academicYearId: string;
  classTeacherId?: string;
  roomNo?: string;
  capacity?: number;
}

export interface CreateSectionData {
  name: string;
  roomNo?: string;
  capacity?: number;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  type: 'THEORY' | 'PRACTICAL' | 'BOTH';
  isOptional?: boolean;
  teacherId?: string;
}

export interface CreateTimetableSlotData {
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomNo?: string;
}

export interface UpdateTimetableData {
  sectionId: string;
  slots: CreateTimetableSlotData[];
}
