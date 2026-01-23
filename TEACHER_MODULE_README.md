# Teacher Management Module - EduNexus

Complete Teacher Management Module implementation for the EduNexus School Management System.

## Overview

The Teacher Management Module provides comprehensive functionality for managing teachers, including CRUD operations, attendance tracking, subject assignments, and profile management.

## Features

### 1. Teacher CRUD Operations
- Create new teachers with complete profile information
- View teacher list with advanced filtering and search
- Edit teacher details
- Delete teachers (with validation for active assignments)
- Automatic employee ID generation (TCH00001 format)

### 2. Teacher Profile Management
- Personal information (name, DOB, gender, blood group, photo)
- Contact details (address, phone, emergency contact)
- Professional information (qualification, specialization, experience)
- Department and designation assignment
- Salary information
- Status management (Active, On Leave, Resigned, Terminated)

### 3. Subject Assignments
- Assign multiple subjects to teachers
- View all assigned subjects with class details
- Remove subject assignments
- Validation to prevent duplicate assignments

### 4. Attendance Management
- Mark daily attendance (Present, Absent, Late, Half Day, Leave)
- Track in-time and out-time
- View attendance history with date range filters
- Attendance statistics and reports

### 5. Advanced Features
- Class teacher designation
- Leave request tracking
- Department-wise filtering
- Search by name, email, or employee ID
- Grid and table view modes
- Real-time statistics dashboard

## File Structure

```
edunexus/
├── apps/web/
│   ├── app/
│   │   ├── api/
│   │   │   ├── teachers/
│   │   │   │   ├── route.ts                    # GET, POST /api/teachers
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts                # GET, PUT, DELETE /api/teachers/[id]
│   │   │   │   │   ├── attendance/
│   │   │   │   │   │   └── route.ts            # GET, POST attendance
│   │   │   │   │   └── subjects/
│   │   │   │   │       └── route.ts            # GET, POST, DELETE subjects
│   │   │   ├── departments/
│   │   │   │   └── route.ts                    # GET departments
│   │   │   └── subjects/
│   │   │       └── route.ts                    # GET subjects
│   │   └── (dashboard)/
│   │       └── teachers/
│   │           ├── page.tsx                    # Teacher list page
│   │           ├── new/
│   │           │   └── page.tsx                # Add new teacher page
│   │           └── [id]/
│   │               ├── page.tsx                # Teacher profile page
│   │               └── edit/
│   │                   └── page.tsx            # Edit teacher page
│   ├── components/
│   │   └── teachers/
│   │       ├── TeacherForm.tsx                 # Reusable form component
│   │       ├── TeacherCard.tsx                 # Teacher card component
│   │       ├── TeacherTable.tsx                # Data table component
│   │       └── SubjectAssignment.tsx           # Subject assignment component
│   └── lib/
│       └── validations/
│           └── teacher.ts                      # Zod validation schemas
```

## API Routes

### 1. Teachers Endpoint

#### GET /api/teachers
List all teachers with filters and pagination.

**Query Parameters:**
- `search` - Search by name, email, or employee ID
- `status` - Filter by status (ACTIVE, ON_LEAVE, RESIGNED, TERMINATED)
- `departmentId` - Filter by department
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Response:**
```json
{
  "teachers": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### POST /api/teachers
Create a new teacher.

**Request Body:**
```json
{
  "email": "teacher@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "bloodGroup": "O+",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "City",
  "state": "State",
  "pincode": "12345",
  "emergencyContact": "+0987654321",
  "qualification": "M.Ed",
  "specialization": "Mathematics",
  "experience": 5,
  "joiningDate": "2024-01-01",
  "departmentId": "dept-id",
  "designation": "Senior Teacher",
  "basicSalary": 50000,
  "photo": "https://example.com/photo.jpg"
}
```

### 2. Single Teacher Endpoint

#### GET /api/teachers/[id]
Get single teacher with all details.

#### PUT /api/teachers/[id]
Update teacher information.

#### DELETE /api/teachers/[id]
Delete a teacher (validates no active assignments).

### 3. Attendance Endpoint

#### POST /api/teachers/[id]/attendance
Mark teacher attendance.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "status": "PRESENT",
  "inTime": "2024-01-15T09:00:00",
  "outTime": "2024-01-15T17:00:00",
  "remarks": "Optional remarks"
}
```

#### GET /api/teachers/[id]/attendance
Get teacher attendance records.

**Query Parameters:**
- `startDate` - Start date filter
- `endDate` - End date filter
- `month` - Month filter (YYYY-MM format)

**Response:**
```json
{
  "attendances": [...],
  "stats": {
    "total": 20,
    "present": 18,
    "absent": 1,
    "late": 1,
    "halfDay": 0,
    "leave": 0
  }
}
```

### 4. Subject Assignment Endpoint

#### GET /api/teachers/[id]/subjects
Get teacher's subject assignments.

#### POST /api/teachers/[id]/subjects
Assign a subject to teacher.

**Request Body:**
```json
{
  "subjectId": "subject-id"
}
```

#### DELETE /api/teachers/[id]/subjects
Remove subject assignment.

**Query Parameters:**
- `subjectId` - Subject ID to remove

## Components

### 1. TeacherForm
Reusable form component for creating and editing teachers.

**Props:**
- `initialData?: Partial<TeacherFormValues>` - Pre-fill data for edit mode
- `onSubmit: (data: TeacherFormValues) => void` - Submit handler
- `isLoading?: boolean` - Loading state
- `isEdit?: boolean` - Edit mode flag

**Features:**
- Form validation with Zod
- React Hook Form integration
- Organized sections (Personal, Contact, Professional, Account)
- Responsive layout
- Error handling

### 2. TeacherCard
Card component for displaying teacher information.

**Props:**
- `teacher: Teacher` - Teacher object

**Features:**
- Avatar display with fallback
- Status badge
- Contact information
- Subject assignments preview
- Action buttons (View, Edit)

### 3. TeacherTable
Data table component with sorting and pagination.

**Props:**
- `data: Teacher[]` - Array of teachers
- `onDelete?: (id: string) => void` - Delete handler

**Features:**
- TanStack Table integration
- Global search filter
- Sortable columns
- Pagination controls
- Row actions menu
- Responsive design

### 4. SubjectAssignment
Component for managing teacher's subject assignments.

**Props:**
- `teacherId: string` - Teacher ID

**Features:**
- View assigned subjects
- Assign new subjects with dialog
- Remove assignments
- Real-time updates with React Query
- Loading and error states

## Pages

### 1. Teachers List Page (`/teachers`)
Main listing page with filters and search.

**Features:**
- Search by name, email, or employee ID
- Filter by status and department
- Switch between grid and table views
- Real-time statistics
- Add new teacher button

### 2. New Teacher Page (`/teachers/new`)
Form for adding a new teacher.

**Features:**
- Complete teacher information form
- Validation and error handling
- Auto-redirect to profile on success

### 3. Teacher Profile Page (`/teachers/[id]`)
Detailed teacher profile view.

**Features:**
- Comprehensive profile header
- Tabbed interface:
  - Overview - Personal and professional details
  - Subjects - Subject assignments management
  - Attendance - Attendance history
  - Leaves - Leave request history
- Edit profile button

### 4. Edit Teacher Page (`/teachers/[id]/edit`)
Form for editing teacher information.

**Features:**
- Pre-filled form with existing data
- Same validation as create form
- Update in place

## Validation Schemas

### Teacher Form Schema
```typescript
{
  email: string (email format)
  password: string (min 6 chars, optional for edit)
  firstName: string (min 2 chars)
  lastName: string (min 2 chars)
  dateOfBirth: string (date)
  gender: enum (MALE, FEMALE, OTHER)
  bloodGroup: string (optional)
  phone: string (optional)
  photo: string (optional)
  address: string (optional)
  city: string (optional)
  state: string (optional)
  pincode: string (optional)
  emergencyContact: string (optional)
  qualification: string (min 2 chars)
  specialization: string (optional)
  experience: number (min 0, default 0)
  joiningDate: string (optional)
  departmentId: string (optional)
  designation: string (optional)
  basicSalary: number (min 0)
  status: enum (ACTIVE, ON_LEAVE, RESIGNED, TERMINATED)
}
```

### Attendance Form Schema
```typescript
{
  date: string (date)
  status: enum (PRESENT, ABSENT, LATE, HALF_DAY, LEAVE)
  inTime: string (optional)
  outTime: string (optional)
  remarks: string (optional)
}
```

## Database Schema

The module uses the following Prisma models:

### Teacher Model
```prisma
model Teacher {
  id              String
  employeeId      String @unique
  userId          String @unique
  user            User
  firstName       String
  lastName        String
  dateOfBirth     DateTime
  gender          Gender
  bloodGroup      String?
  photo           String?
  address         String?
  city            String?
  state           String?
  pincode         String?
  emergencyContact String?
  qualification   String
  specialization  String?
  experience      Int
  joiningDate     DateTime
  departmentId    String?
  department      Department?
  designation     String?
  basicSalary     Decimal
  status          EmployeeStatus
  classTeacher    Class?
  subjectAssignments SubjectAssignment[]
  attendances     TeacherAttendance[]
  leaveRequests   LeaveRequest[]
  timetableSlots  TimetableSlot[]
}
```

## Usage Examples

### Creating a Teacher
```typescript
const createTeacher = async (data: TeacherFormValues) => {
  const response = await fetch('/api/teachers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### Fetching Teachers with Filters
```typescript
const fetchTeachers = async (filters: {
  search?: string;
  status?: string;
  departmentId?: string;
}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/teachers?${params}`);
  return response.json();
};
```

### Assigning a Subject
```typescript
const assignSubject = async (teacherId: string, subjectId: string) => {
  const response = await fetch(`/api/teachers/${teacherId}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectId }),
  });
  return response.json();
};
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **date-fns** - Date formatting

## Security Features

1. **Password Hashing** - bcryptjs for secure password storage
2. **Input Validation** - Zod schemas for all inputs
3. **SQL Injection Prevention** - Prisma ORM
4. **Duplicate Prevention** - Unique constraints on email and employee ID
5. **Cascading Deletes** - Proper relationship handling
6. **Assignment Validation** - Prevents deleting teachers with active assignments

## Performance Optimizations

1. **Server-Side Pagination** - Efficient data loading
2. **Query Caching** - TanStack Query with 60s stale time
3. **Optimistic Updates** - Immediate UI feedback
4. **Lazy Loading** - Components loaded on demand
5. **Database Indexes** - Optimized queries

## Future Enhancements

1. **Bulk Operations** - Import/export teachers via CSV
2. **Document Management** - Upload and store teacher documents
3. **Performance Reviews** - Teacher evaluation system
4. **Timetable Integration** - Visual timetable management
5. **Salary Processing** - Automated salary calculation
6. **Notifications** - Email/SMS notifications for important events
7. **Reports** - Comprehensive teacher reports and analytics
8. **Photo Upload** - Direct image upload functionality
9. **Advanced Filters** - More filter options and saved filters
10. **Audit Logs** - Track all changes to teacher records

## Testing

To test the module:

1. Start the development server:
```bash
cd apps/web
pnpm dev
```

2. Navigate to `/teachers` in your browser

3. Test the following workflows:
   - Create a new teacher
   - View teacher list with filters
   - Edit teacher information
   - Assign subjects to teacher
   - View teacher profile
   - Delete a teacher

## Troubleshooting

### Common Issues

1. **Teacher creation fails**
   - Ensure all required fields are filled
   - Check if email already exists
   - Verify database connection

2. **Subject assignment fails**
   - Ensure subject exists
   - Check for duplicate assignments
   - Verify teacher is active

3. **Delete fails**
   - Check if teacher has active subject assignments
   - Verify teacher is not a class teacher
   - Remove assignments before deleting

## Support

For issues or questions, please contact the development team or refer to the main project documentation.

## License

This module is part of the EduNexus School Management System. All rights reserved.
