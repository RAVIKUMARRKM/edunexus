# Examination & Grading Module - EduNexus

A comprehensive examination and grading system for managing exams, schedules, grade entry, and report card generation.

## Features

### 1. Exam Management
- Create and manage exams with different types (Unit Test, Mid-Term, Final, Practical, Assignment)
- Configure max marks and passing marks per exam
- Publish/unpublish exams to control visibility
- Link exams to academic years and classes

### 2. Exam Scheduling
- Create detailed exam schedules for each subject
- Specify date, time, and room number for each exam
- Validate schedules within exam period
- Prevent duplicate schedules for subjects

### 3. Grade Entry
- Bulk grade entry interface with subject selection
- Real-time grade calculation based on marks
- Mark students as absent
- Add remarks for individual students
- Input validation (marks between 0 and max marks)
- Automatic grade assignment based on grade scale

### 4. Results & Analytics
- View all exam results with filters
- Student-wise and subject-wise result views
- Pass/fail statistics
- Search and filter functionality
- Export capability

### 5. Report Card Generation
- Comprehensive report cards for individual students
- Subject-wise marks, grades, and percentages
- Overall performance summary
- Class rank calculation
- Printable format

## Project Structure

```
apps/web/
├── app/
│   ├── api/exams/
│   │   ├── route.ts                          # GET/POST exams
│   │   ├── [id]/
│   │   │   ├── route.ts                      # GET/PUT/DELETE single exam
│   │   │   ├── schedule/route.ts             # GET/POST exam schedule
│   │   │   ├── results/route.ts              # GET/POST exam results
│   │   │   ├── students/route.ts             # GET students for exam
│   │   │   └── report-card/[studentId]/route.ts  # GET report card
│   │   └── ...
│   └── (dashboard)/exams/
│       ├── page.tsx                          # Exam list with filters
│       ├── new/page.tsx                      # Create new exam
│       ├── [id]/
│       │   ├── page.tsx                      # Exam details & schedule
│       │   ├── grades/page.tsx               # Grade entry interface
│       │   └── results/page.tsx              # View all results
│       └── report-cards/page.tsx             # Report card generation
│
└── components/exams/
    ├── ExamForm.tsx                          # Exam creation form
    ├── ExamScheduleForm.tsx                  # Schedule management
    ├── GradeEntry.tsx                        # Bulk grade entry
    ├── ResultsTable.tsx                      # Results display
    └── ReportCard.tsx                        # Printable report card
```

## API Endpoints

### Exam Management

#### GET /api/exams
List all exams with optional filters

**Query Parameters:**
- `academicYearId` - Filter by academic year
- `classId` - Filter by class
- `examType` - Filter by exam type (UNIT_TEST, MID_TERM, FINAL, etc.)
- `isPublished` - Filter by published status (true/false)

**Response:**
```json
[
  {
    "id": "exam_id",
    "name": "Mid Term Examination",
    "examType": "MID_TERM",
    "startDate": "2024-10-01",
    "endDate": "2024-10-15",
    "maxMarks": 100,
    "passingMarks": 33,
    "isPublished": true,
    "academicYear": { "name": "2024-2025" },
    "class": { "name": "Class 10" },
    "_count": {
      "results": 150,
      "schedules": 8
    }
  }
]
```

#### POST /api/exams
Create a new exam

**Request Body:**
```json
{
  "name": "Final Examination 2024",
  "academicYearId": "year_id",
  "classId": "class_id",
  "examType": "FINAL",
  "startDate": "2024-12-01",
  "endDate": "2024-12-15",
  "maxMarks": 100,
  "passingMarks": 33,
  "isPublished": false
}
```

#### GET /api/exams/[id]
Get single exam details with schedules and results

#### PUT /api/exams/[id]
Update exam details

#### DELETE /api/exams/[id]
Delete exam (only if no results exist)

### Exam Scheduling

#### GET /api/exams/[id]/schedule
Get exam schedule for all subjects

#### POST /api/exams/[id]/schedule
Create exam schedule for a subject

**Request Body:**
```json
{
  "subjectId": "subject_id",
  "date": "2024-10-05",
  "startTime": "09:00",
  "endTime": "12:00",
  "roomNo": "Room 101"
}
```

### Grade Entry & Results

#### GET /api/exams/[id]/results
Get exam results with optional filters

**Query Parameters:**
- `studentId` - Filter by student
- `subjectId` - Filter by subject

#### POST /api/exams/[id]/results
Create or update exam results (bulk operation)

**Request Body:**
```json
{
  "results": [
    {
      "studentId": "student_id",
      "subjectId": "subject_id",
      "marksObtained": 85,
      "isAbsent": false,
      "remarks": "Good performance"
    }
  ]
}
```

**Features:**
- Automatic grade calculation based on percentage
- Grade scale lookup from database
- Upsert operation (create or update)
- Validation of marks (0 to maxMarks)
- Absent students get grade "AB"

### Report Card

#### GET /api/exams/[id]/report-card/[studentId]
Generate comprehensive report card for a student

**Response Includes:**
- Student and exam details
- Subject-wise marks, grades, percentages
- Overall performance summary
- Class rank calculation
- Pass/fail status per subject
- Overall result (PASS/FAIL)

## Database Schema

The module uses the following Prisma models:

### Exam
```prisma
model Exam {
  id             String   @id @default(cuid())
  name           String
  academicYearId String
  classId        String
  examType       ExamType
  startDate      DateTime
  endDate        DateTime
  maxMarks       Int      @default(100)
  passingMarks   Int      @default(33)
  isPublished    Boolean  @default(false)

  results        ExamResult[]
  schedules      ExamSchedule[]
}
```

### ExamSchedule
```prisma
model ExamSchedule {
  id        String   @id @default(cuid())
  examId    String
  subjectId String
  date      DateTime
  startTime String
  endTime   String
  roomNo    String?

  @@unique([examId, subjectId])
}
```

### ExamResult
```prisma
model ExamResult {
  id            String   @id @default(cuid())
  examId        String
  studentId     String
  subjectId     String
  marksObtained Decimal  @db.Decimal(5, 2)
  grade         String?
  remarks       String?
  isAbsent      Boolean  @default(false)

  @@unique([examId, studentId, subjectId])
}
```

### GradeScale
```prisma
model GradeScale {
  id         String   @id @default(cuid())
  name       String   // A+, A, B+, etc.
  minPercent Decimal  @db.Decimal(5, 2)
  maxPercent Decimal  @db.Decimal(5, 2)
  gradePoint Decimal  @db.Decimal(3, 2)
  remarks    String?  // Excellent, Good, etc.
}
```

## Grade Calculation Logic

Grades are automatically calculated based on the percentage of marks obtained:

1. Calculate percentage: `(marksObtained / maxMarks) * 100`
2. Look up grade scale table for matching grade
3. Assign grade based on percentage range
4. Students marked absent get grade "AB"

**Default Grade Scale:**
- A+: 90-100%
- A: 80-89%
- B+: 70-79%
- B: 60-69%
- C: 50-59%
- D: 33-49% (passing)
- F: Below 33% (failing)

## Usage Examples

### Creating an Exam

1. Navigate to `/exams`
2. Click "Create Exam"
3. Fill in exam details (name, type, dates, marks)
4. Select academic year and class
5. Submit to create exam

### Creating Exam Schedule

1. Open exam details page
2. Go to "Schedule" tab
3. Click "Add Schedule"
4. Select subject, date, time, and room
5. Repeat for all subjects

### Entering Grades

1. Open exam details page
2. Click "Grade Entry" or navigate to `/exams/[id]/grades`
3. Select subject from dropdown
4. Enter marks for each student
5. Mark absent students if needed
6. Add remarks (optional)
7. Click "Save Grades"

### Viewing Results

1. Open exam details page
2. Go to "Results" tab or navigate to `/exams/[id]/results`
3. Use filters to search/filter results
4. View statistics (pass/fail counts, percentages)
5. Click on student to view report card

### Generating Report Cards

1. Navigate to `/exams/report-cards`
2. Select exam from dropdown
3. Select student from dropdown
4. Click "Generate Report Card"
5. View or print report card

## Features to Note

### Automatic Grade Calculation
- Grades are calculated automatically when saving results
- Based on configurable grade scale in database
- Real-time grade preview in grade entry interface

### Validation & Error Handling
- Marks cannot exceed max marks
- Start date must be before end date
- Schedule dates must be within exam period
- Cannot delete exam with existing results
- Duplicate schedule prevention

### Bulk Operations
- Bulk grade entry for all students in a subject
- Single API call to save all grades
- Transaction-based to ensure data consistency

### Report Card Features
- Professional printable format
- Complete subject-wise breakdown
- Overall performance metrics
- Class rank calculation
- Grade scale reference

## Future Enhancements

Potential improvements for the module:

1. **Grade Scale Configuration**: UI for managing custom grade scales
2. **Bulk Import**: Excel import for grades
3. **Analytics Dashboard**: Visual charts and trends
4. **Comparison Reports**: Compare student performance across exams
5. **Email Notifications**: Auto-send report cards to parents
6. **Mobile App Support**: Grade entry from mobile devices
7. **Offline Support**: Work offline and sync later
8. **Multi-language**: Support for multiple languages in report cards
9. **PDF Export**: Direct PDF generation for report cards
10. **Grade Remarks Templates**: Quick select common remarks

## Dependencies

- Next.js 14
- Prisma (Database ORM)
- shadcn/ui (UI Components)
- React Hook Form (Form Management)
- date-fns (Date Formatting)
- Zod (Validation)

## Notes

- All dates are stored in ISO format in the database
- Marks are stored as Decimal(5,2) for precision
- Grade calculation happens server-side for consistency
- Report cards are generated on-demand, not cached
- Print styles are included for report cards
