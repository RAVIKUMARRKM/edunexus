# Class & Section Management Module

## Overview

The Class & Section Management Module is a comprehensive system for managing classes, sections, subjects, and timetables in the EduNexus school management system.

## Features

### 1. Class Management
- Create, view, update, and delete classes
- Assign class teachers
- Set room numbers and capacity
- Link to academic years
- Track student enrollment statistics

### 2. Section Management
- Create multiple sections per class (A, B, C, etc.)
- Assign room numbers and capacity to sections
- Track student count per section
- Manage section-specific timetables

### 3. Subject Management
- Create and assign subjects to classes
- Support for Theory, Practical, and Both types
- Optional/Mandatory subject designation
- Assign teachers to subjects

### 4. Timetable Management
- Create weekly timetables for each section
- Assign subjects, teachers, and rooms to time slots
- Visual grid view by day of week
- Edit and manage timetable slots

### 5. Student Management
- View all students in a class
- Filter by section
- Search by name, admission number, or roll number
- Quick access to student details

## Architecture

### Directory Structure

```
apps/web/
├── app/
│   ├── api/
│   │   ├── classes/
│   │   │   ├── route.ts                    # GET, POST /api/classes
│   │   │   └── [id]/
│   │   │       ├── route.ts                # GET, PUT, DELETE /api/classes/[id]
│   │   │       ├── sections/
│   │   │       │   └── route.ts            # GET, POST sections
│   │   │       ├── subjects/
│   │   │       │   └── route.ts            # GET, POST subjects
│   │   │       └── timetable/
│   │   │           └── route.ts            # GET, PUT timetable
│   │   └── sections/
│   │       ├── route.ts                    # GET /api/sections
│   │       └── [id]/
│   │           └── route.ts                # GET, PUT, DELETE /api/sections/[id]
│   └── (dashboard)/
│       └── classes/
│           ├── page.tsx                    # Class list view
│           ├── new/
│           │   └── page.tsx                # Create new class
│           └── [id]/
│               ├── page.tsx                # Class details
│               ├── timetable/
│               │   └── page.tsx            # Timetable view/edit
│               └── students/
│                   └── page.tsx            # Students in class
├── components/
│   └── classes/
│       ├── ClassCard.tsx                   # Class summary card
│       ├── ClassForm.tsx                   # Create class form
│       ├── SectionForm.tsx                 # Create section form
│       ├── SubjectForm.tsx                 # Create subject form
│       ├── TimetableGrid.tsx               # Timetable grid view
│       └── index.ts                        # Component exports
└── lib/
    ├── api-client.ts                       # API client utilities
    └── types/
        └── class.ts                        # TypeScript type definitions
```

## API Endpoints

### Classes

#### GET /api/classes
List all classes with optional filtering.

**Query Parameters:**
- `academicYearId` (optional): Filter by academic year
- `includeDetails` (optional): Include sections and subjects

**Response:**
```json
[
  {
    "id": "class_id",
    "name": "Class 10",
    "numericValue": 10,
    "roomNo": "101",
    "capacity": 40,
    "academicYear": {
      "id": "year_id",
      "name": "2024-2025",
      "isCurrent": true
    },
    "classTeacher": {
      "user": {
        "name": "John Doe"
      }
    },
    "_count": {
      "students": 35,
      "sections": 3,
      "subjects": 8
    }
  }
]
```

#### POST /api/classes
Create a new class.

**Request Body:**
```json
{
  "name": "Class 10",
  "numericValue": 10,
  "academicYearId": "year_id",
  "classTeacherId": "teacher_id", // optional
  "roomNo": "101", // optional
  "capacity": 40
}
```

#### GET /api/classes/[id]
Get a single class with full details.

**Response:**
```json
{
  "id": "class_id",
  "name": "Class 10",
  "sections": [...],
  "subjects": [...],
  "_count": {...}
}
```

#### PUT /api/classes/[id]
Update a class.

**Request Body:**
```json
{
  "name": "Class 10-A",
  "classTeacherId": "new_teacher_id",
  "roomNo": "102",
  "capacity": 45
}
```

#### DELETE /api/classes/[id]
Delete a class (fails if students are enrolled).

### Sections

#### GET /api/classes/[id]/sections
Get all sections for a class.

#### POST /api/classes/[id]/sections
Create a new section.

**Request Body:**
```json
{
  "name": "A",
  "roomNo": "101-A", // optional
  "capacity": 40
}
```

#### GET /api/sections/[id]
Get section details with students and timetable.

#### PUT /api/sections/[id]
Update a section.

#### DELETE /api/sections/[id]
Delete a section (fails if students are enrolled).

### Subjects

#### GET /api/classes/[id]/subjects
Get all subjects for a class.

#### POST /api/classes/[id]/subjects
Create a new subject.

**Request Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "type": "THEORY", // THEORY | PRACTICAL | BOTH
  "isOptional": false,
  "teacherId": "teacher_id" // optional
}
```

### Timetable

#### GET /api/classes/[id]/timetable?sectionId=section_id
Get timetable for a section.

**Response:**
```json
[
  {
    "id": "slot_id",
    "dayOfWeek": 1, // Monday
    "startTime": "09:00",
    "endTime": "09:45",
    "subject": {
      "name": "Mathematics",
      "code": "MATH101"
    },
    "teacher": {
      "user": {
        "name": "Jane Doe"
      }
    },
    "roomNo": "101"
  }
]
```

#### PUT /api/classes/[id]/timetable
Update timetable for a section.

**Request Body:**
```json
{
  "sectionId": "section_id",
  "slots": [
    {
      "subjectId": "subject_id",
      "teacherId": "teacher_id",
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "09:45",
      "roomNo": "101" // optional
    }
  ]
}
```

## Components

### ClassCard
Displays a summary card for a class with key statistics.

**Props:**
- `classData`: Class object with academic year, teacher, and counts

### ClassForm
Form for creating a new class.

**Props:**
- `academicYears`: Array of academic years
- `teachers`: Array of teachers
- `onSuccess`: Callback function on successful creation

### SectionForm
Form for creating a new section.

**Props:**
- `classId`: ID of the parent class
- `onSuccess`: Callback function on successful creation

### SubjectForm
Form for creating a new subject.

**Props:**
- `classId`: ID of the parent class
- `teachers`: Array of teachers
- `onSuccess`: Callback function on successful creation

### TimetableGrid
Visual grid display of timetable slots.

**Props:**
- `slots`: Array of timetable slots
- `onEdit`: Callback for editing a slot
- `onDelete`: Callback for deleting a slot
- `editable`: Whether the timetable is editable

## Pages

### /classes
Main class list page with search and grid view of all classes.

**Features:**
- Search classes by name
- Card-based grid layout
- Quick statistics for each class
- Add new class button

### /classes/new
Create new class page with form.

**Features:**
- Auto-loads academic years and teachers
- Form validation
- Redirects to class list on success

### /classes/[id]
Class details page with tabs for sections, subjects, and students.

**Features:**
- Overview statistics
- Tabbed interface
- Inline section and subject creation
- Quick links to timetable and students

### /classes/[id]/timetable
Timetable management page.

**Features:**
- Section selector
- Day-by-day view
- Add, edit, delete timetable slots
- Visual time slot display

### /classes/[id]/students
Student list page with filtering.

**Features:**
- Search by name, admission number, roll number
- Filter by section
- Table view with student details
- Quick links to student profiles

## Database Schema

The module uses the following Prisma models:

### Class
```prisma
model Class {
  id              String   @id @default(cuid())
  name            String
  numericValue    Int
  academicYearId  String
  academicYear    AcademicYear @relation(...)
  classTeacherId  String?  @unique
  classTeacher    Teacher? @relation(...)
  roomNo          String?
  capacity        Int      @default(40)
  sections        Section[]
  subjects        Subject[]
  students        Student[]
  // ... timestamps and other fields
}
```

### Section
```prisma
model Section {
  id        String   @id @default(cuid())
  name      String
  classId   String
  class     Class    @relation(...)
  roomNo    String?
  capacity  Int      @default(40)
  students  Student[]
  timetableSlots TimetableSlot[]
  // ... timestamps
}
```

### Subject
```prisma
model Subject {
  id          String   @id @default(cuid())
  name        String
  code        String
  classId     String
  class       Class    @relation(...)
  type        SubjectType @default(THEORY)
  isOptional  Boolean  @default(false)
  assignments SubjectAssignment[]
  timetableSlots TimetableSlot[]
  // ... timestamps
}
```

### TimetableSlot
```prisma
model TimetableSlot {
  id        String   @id @default(cuid())
  sectionId String
  section   Section  @relation(...)
  subjectId String
  subject   Subject  @relation(...)
  teacherId String
  teacher   Teacher  @relation(...)
  dayOfWeek Int      // 0-6
  startTime String   // "09:00"
  endTime   String   // "09:45"
  roomNo    String?
  // ... timestamps
}
```

## Usage Examples

### Fetching Classes with React Query

```tsx
import { useQuery } from '@tanstack/react-query';

function ClassList() {
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      return response.json();
    },
  });

  // Render classes...
}
```

### Creating a New Class

```tsx
import { classesAPI } from '@/lib/api-client';
import { useMutation } from '@tanstack/react-query';

function CreateClass() {
  const createMutation = useMutation({
    mutationFn: (data) => classesAPI.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['classes']);
    },
  });

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  // Render form...
}
```

### Using the API Client

```tsx
import { classesAPI } from '@/lib/api-client';

// List all classes
const classes = await classesAPI.list();

// Get a specific class
const classData = await classesAPI.get('class_id');

// Create sections
const section = await classesAPI.sections.create('class_id', {
  name: 'A',
  capacity: 40,
});

// Update timetable
await classesAPI.timetable.update('class_id', 'section_id', slots);
```

## Error Handling

All API routes include proper error handling:

- **401 Unauthorized**: User not authenticated
- **400 Bad Request**: Missing required fields or validation errors
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate entry (e.g., section already exists)
- **500 Internal Server Error**: Database or server errors

## Security

- All routes require authentication via NextAuth
- Session validation on every request
- Proper authorization checks (to be implemented)
- Input validation and sanitization

## Future Enhancements

1. **Role-based Access Control**: Restrict actions based on user roles
2. **Bulk Operations**: Import/export classes, sections, and timetables
3. **Timetable Conflicts**: Detect and prevent scheduling conflicts
4. **Class Promotion**: Promote entire class to next grade
5. **Analytics**: Class performance metrics and reports
6. **Mobile App Support**: Dedicated mobile views for timetable
7. **Real-time Updates**: WebSocket support for live timetable changes
8. **Attendance Integration**: Link timetable with attendance tracking
9. **Exam Scheduling**: Integrate with examination module
10. **Resource Allocation**: Track room and equipment usage

## Testing

To test the module:

1. Ensure database is running and migrations are applied
2. Start the development server: `npm run dev`
3. Navigate to `/classes` in your browser
4. Test creating, editing, and deleting classes
5. Test section and subject management
6. Test timetable creation and editing

## Dependencies

- **Next.js 14**: React framework
- **Prisma**: Database ORM
- **TanStack Query**: Data fetching and caching
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **shadcn/ui**: UI components
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Contributing

When contributing to this module:

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Include error handling in API routes
4. Update this documentation
5. Test thoroughly before committing

## License

Part of the EduNexus School Management System.
