# Student Management Module - EduNexus

Complete documentation for the Student Management Module of the EduNexus school management system.

## Overview

The Student Management Module provides comprehensive functionality to manage student records, attendance, documents, and related information. It integrates with other modules like Classes, Sections, Parents, Fees, Library, Transport, and Hostel.

## Features

- Complete student profile management
- Admission and enrollment tracking
- Attendance marking and reporting
- Document management
- Parent information tracking
- Integration with academic, transport, and hostel modules
- Advanced search and filtering
- Bulk operations support

## File Structure

```
apps/web/
├── app/
│   ├── api/
│   │   └── students/
│   │       ├── route.ts                      # GET (list), POST (create)
│   │       ├── [id]/
│   │       │   ├── route.ts                  # GET, PUT, DELETE
│   │       │   ├── attendance/
│   │       │   │   └── route.ts              # GET, POST attendance
│   │       │   └── documents/
│   │       │       └── route.ts              # GET, POST documents
│   └── (dashboard)/
│       └── students/
│           ├── page.tsx                      # Student list page
│           ├── new/
│           │   └── page.tsx                  # Create student page
│           └── [id]/
│               ├── page.tsx                  # Student profile page
│               └── edit/
│                   └── page.tsx              # Edit student page
├── components/
│   └── students/
│       ├── StudentForm.tsx                   # Reusable form component
│       ├── StudentCard.tsx                   # Profile card component
│       ├── StudentTable.tsx                  # Data table component
│       └── AttendanceMarker.tsx              # Attendance marking component
```

## API Routes

### 1. GET /api/students

List all students with filtering and pagination.

**Query Parameters:**
- `search` - Search by name, admission number, or roll number
- `classId` - Filter by class
- `sectionId` - Filter by section
- `status` - Filter by status (ACTIVE, INACTIVE, LEFT, GRADUATED, SUSPENDED)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "student_id",
      "admissionNo": "ADM001",
      "rollNo": "1",
      "firstName": "John",
      "lastName": "Doe",
      "gender": "MALE",
      "dateOfBirth": "2010-01-15",
      "status": "ACTIVE",
      "user": {
        "email": "john.doe@student.edunexus.com",
        "phone": "+91 9876543210"
      },
      "class": {
        "id": "class_id",
        "name": "Class 10"
      },
      "section": {
        "id": "section_id",
        "name": "A"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. POST /api/students

Create a new student record.

**Request Body:**
```json
{
  "admissionNo": "ADM001",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2010-01-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "religion": "Hindu",
  "nationality": "Indian",
  "classId": "class_id",
  "sectionId": "section_id",
  "email": "john.doe@example.com",
  "phone": "+91 9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "fatherName": "John Doe Sr.",
  "fatherPhone": "+91 9876543211",
  "fatherEmail": "father@example.com",
  "motherName": "Jane Doe",
  "motherPhone": "+91 9876543212"
}
```

**Response:**
```json
{
  "id": "student_id",
  "admissionNo": "ADM001",
  "firstName": "John",
  "lastName": "Doe",
  ...
}
```

### 3. GET /api/students/[id]

Get detailed information about a specific student.

**Response:**
```json
{
  "id": "student_id",
  "admissionNo": "ADM001",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2010-01-15",
  "gender": "MALE",
  "status": "ACTIVE",
  "user": { ... },
  "class": { ... },
  "section": { ... },
  "parents": [ ... ],
  "attendances": [ ... ],
  "examResults": [ ... ],
  "feePayments": [ ... ],
  "documents": [ ... ],
  "transportAllocation": { ... },
  "hostelAllocation": { ... }
}
```

### 4. PUT /api/students/[id]

Update student information.

**Request Body:**
Same as POST, but all fields are optional.

**Response:**
Updated student object.

### 5. DELETE /api/students/[id]

Delete a student record.

**Response:**
```json
{
  "message": "Student deleted successfully"
}
```

### 6. POST /api/students/[id]/attendance

Mark attendance for a student.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "status": "PRESENT",
  "remarks": "Optional remarks"
}
```

**Status Values:**
- `PRESENT` - Student is present
- `ABSENT` - Student is absent
- `LATE` - Student came late
- `HALF_DAY` - Student attended half day
- `LEAVE` - Student is on leave

**Response:**
```json
{
  "id": "attendance_id",
  "studentId": "student_id",
  "date": "2024-01-15",
  "status": "PRESENT",
  "remarks": null
}
```

### 7. GET /api/students/[id]/attendance

Get attendance records for a student.

**Query Parameters:**
- `startDate` - Start date for range
- `endDate` - End date for range
- `month` - Get attendance for specific month (YYYY-MM)

**Response:**
```json
{
  "data": [
    {
      "id": "attendance_id",
      "date": "2024-01-15",
      "status": "PRESENT",
      "remarks": null
    }
  ],
  "statistics": {
    "total": 20,
    "present": 18,
    "absent": 1,
    "late": 1,
    "halfDay": 0,
    "leave": 0,
    "percentage": 90.0
  }
}
```

### 8. GET /api/students/[id]/documents

Get all documents for a student.

**Response:**
```json
[
  {
    "id": "document_id",
    "name": "Birth Certificate",
    "type": "birth_certificate",
    "fileUrl": "https://example.com/documents/birth_cert.pdf",
    "uploadedAt": "2024-01-15T10:00:00Z"
  }
]
```

### 9. POST /api/students/[id]/documents

Upload a document for a student.

**Request Body:**
```json
{
  "name": "Birth Certificate",
  "type": "birth_certificate",
  "fileUrl": "https://example.com/documents/birth_cert.pdf"
}
```

**Document Types:**
- `birth_certificate`
- `tc` (Transfer Certificate)
- `marksheet`
- `photo`
- `id_proof`
- `address_proof`
- `other`

## Components

### StudentForm

Reusable form component for creating and editing students.

**Props:**
```typescript
interface StudentFormProps {
  initialData?: Partial<StudentInput>;
  onSubmit: (data: StudentInput) => Promise<void>;
  isLoading?: boolean;
  classes?: Array<{ id: string; name: string }>;
  sections?: Array<{ id: string; name: string }>;
}
```

**Features:**
- Form validation using react-hook-form and zod
- Automatic section filtering based on selected class
- Organized into sections: Basic Info, Academic Info, Contact Info, Parent Info
- Responsive design

### StudentCard

Displays student information in a card format.

**Props:**
```typescript
interface StudentCardProps {
  student: Student;
}
```

**Features:**
- Shows student photo/avatar
- Displays key information
- Status badge
- Quick action buttons

### StudentTable

Data table component for displaying list of students.

**Props:**
```typescript
interface StudentTableProps {
  students: Student[];
  onDelete?: (id: string) => void;
}
```

**Features:**
- Sortable columns
- Status badges
- Action buttons
- Responsive design

### AttendanceMarker

Component for marking student attendance.

**Props:**
```typescript
interface AttendanceMarkerProps {
  studentId: string;
  onSubmit: (data: AttendanceData) => Promise<void>;
  isLoading?: boolean;
}
```

**Features:**
- Date picker
- Visual status selection
- Optional remarks field
- Validation

## Pages

### Student List Page (`/students`)

**Features:**
- Search by name, admission number, or roll number
- Filter by class, section, and status
- Pagination
- Quick stats
- Create new student button
- Edit and delete actions

### Create Student Page (`/students/new`)

**Features:**
- Multi-section form
- Class and section selection
- Parent information
- Form validation
- Loading states

### Student Profile Page (`/students/[id]`)

**Features:**
- Complete student information
- Profile card with photo
- Academic details
- Contact information
- Parent information
- Recent attendance
- Attendance marking
- Transport and hostel information
- Edit profile button

### Edit Student Page (`/students/[id]/edit`)

**Features:**
- Pre-filled form with existing data
- Same validation as create form
- Cancel and save buttons
- Loading states

## Database Schema

The Student module uses the following Prisma models:

### Student
```prisma
model Student {
  id                String   @id @default(cuid())
  admissionNo       String   @unique
  rollNo            String?
  userId            String   @unique

  // Personal Details
  firstName         String
  lastName          String
  dateOfBirth       DateTime
  gender            Gender
  bloodGroup        String?
  religion          String?
  nationality       String   @default("Indian")

  // Contact Details
  address           String?
  city              String?
  state             String?
  pincode           String?

  // Academic Details
  classId           String?
  sectionId         String?

  // Status
  status            StudentStatus @default(ACTIVE)

  // Relations
  user              User     @relation(...)
  class             Class?   @relation(...)
  section           Section? @relation(...)
  parents           StudentParent[]
  attendances       StudentAttendance[]
  documents         StudentDocument[]
}
```

### StudentAttendance
```prisma
model StudentAttendance {
  id        String           @id @default(cuid())
  studentId String
  date      DateTime
  status    AttendanceStatus
  remarks   String?

  @@unique([studentId, date])
}
```

### StudentDocument
```prisma
model StudentDocument {
  id         String   @id @default(cuid())
  studentId  String
  name       String
  type       String
  fileUrl    String
  uploadedAt DateTime @default(now())
}
```

## Usage Examples

### Creating a Student

```typescript
const createStudent = async (data: StudentInput) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
```

### Fetching Students with Filters

```typescript
const fetchStudents = async (filters: {
  search?: string;
  classId?: string;
  sectionId?: string;
  status?: string;
  page?: number;
}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.classId) params.append('classId', filters.classId);
  if (filters.sectionId) params.append('sectionId', filters.sectionId);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', filters.page.toString());

  const response = await fetch(`/api/students?${params.toString()}`);
  return response.json();
};
```

### Marking Attendance

```typescript
const markAttendance = async (
  studentId: string,
  data: {
    date: string;
    status: AttendanceStatus;
    remarks?: string;
  }
) => {
  const response = await fetch(`/api/students/${studentId}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
```

## Validation

All forms use Zod schemas from `@edunexus/shared` for validation:

```typescript
import { studentSchema } from '@edunexus/shared';

// The schema validates:
// - Required fields (admissionNo, firstName, lastName, etc.)
// - Email format
// - Date formats
// - Enum values (gender, status, etc.)
```

## Authentication

All API routes are protected with NextAuth session validation:

```typescript
const session = await getServerSession();
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Error Handling

The module implements comprehensive error handling:

- Form validation errors
- API error responses
- Network errors
- Loading states
- Empty states

Example:
```typescript
try {
  const response = await fetch('/api/students');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch students');
  }
  return response.json();
} catch (error) {
  toast({
    title: 'Error',
    description: error.message,
    variant: 'destructive',
  });
}
```

## Responsive Design

All components and pages are fully responsive:

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid layouts adapt to screen size
- Touch-friendly buttons and inputs

## Future Enhancements

Potential improvements for the Student Management Module:

1. Bulk import/export functionality
2. Advanced reporting and analytics
3. Student performance tracking
4. Behavior and conduct records
5. Photo upload and management
6. QR code generation for student IDs
7. SMS/Email notifications to parents
8. Student portal for self-service
9. Biometric attendance integration
10. Transfer certificate generation

## Support

For issues or questions about the Student Management Module, please refer to:
- Main documentation: `/docs/README.md`
- API documentation: `/docs/API.md`
- Component library: `/docs/COMPONENTS.md`

## License

Part of the EduNexus School Management System.
