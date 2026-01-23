# Examination Module - Quick Reference

## API Endpoints Cheat Sheet

### Exams
```
GET    /api/exams                           # List all exams
POST   /api/exams                           # Create exam
GET    /api/exams/[id]                      # Get exam details
PUT    /api/exams/[id]                      # Update exam
DELETE /api/exams/[id]                      # Delete exam
```

### Schedules
```
GET    /api/exams/[id]/schedule             # Get schedules
POST   /api/exams/[id]/schedule             # Create schedule
```

### Results
```
GET    /api/exams/[id]/results              # Get results
POST   /api/exams/[id]/results              # Save results (bulk)
```

### Helpers
```
GET    /api/exams/[id]/students             # Get students
GET    /api/exams/[id]/report-card/[sid]    # Get report card
GET    /api/academic-years                  # Get academic years
GET    /api/classes                         # Get classes
```

---

## Page Routes

```
/exams                                      # Exams list
/exams/new                                  # Create exam
/exams/[id]                                 # Exam details
/exams/[id]/grades                          # Grade entry
/exams/[id]/results                         # View results
/exams/report-cards                         # Generate report cards
```

---

## Component Import Paths

```typescript
import ExamForm from '@/components/exams/ExamForm';
import ExamScheduleForm from '@/components/exams/ExamScheduleForm';
import GradeEntry from '@/components/exams/GradeEntry';
import ResultsTable from '@/components/exams/ResultsTable';
import ReportCard from '@/components/exams/ReportCard';
```

---

## Common API Payloads

### Create Exam
```json
{
  "name": "Mid Term Exam 2024",
  "academicYearId": "cuid_here",
  "classId": "cuid_here",
  "examType": "MID_TERM",
  "startDate": "2024-10-01",
  "endDate": "2024-10-15",
  "maxMarks": 100,
  "passingMarks": 33,
  "isPublished": false
}
```

### Create Schedule
```json
{
  "subjectId": "cuid_here",
  "date": "2024-10-05",
  "startTime": "09:00",
  "endTime": "12:00",
  "roomNo": "Room 101"
}
```

### Save Results
```json
{
  "results": [
    {
      "studentId": "cuid_here",
      "subjectId": "cuid_here",
      "marksObtained": 85,
      "isAbsent": false,
      "remarks": "Good"
    }
  ]
}
```

---

## Utility Functions

### Grade Calculation
```typescript
import {
  calculateGrade,           // DB lookup
  calculateGradeLocal,      // Fast, no DB
  calculatePercentage,
  isPassed,
} from '@/lib/grade-utils';

// Calculate grade from percentage
const grade = calculateGradeLocal(85.5); // Returns 'A'

// Calculate percentage
const pct = calculatePercentage(85, 100); // Returns 85

// Check if passed
const passed = isPassed(85, 33); // Returns true
```

### Formatting
```typescript
import {
  formatMarks,
  getGradeColor,
  getExamTypeColor,
} from '@/lib/grade-utils';

// Format marks
const display = formatMarks(85.5, false); // "85.50"
const absent = formatMarks(0, true);      // "AB"

// Get badge color
const color = getGradeColor('A'); // "bg-green-400"
```

### Statistics
```typescript
import {
  calculateSubjectStatistics,
  calculatePassPercentage,
} from '@/lib/grade-utils';

// Calculate subject stats
const stats = calculateSubjectStatistics(
  results,
  maxMarks,
  passingMarks
);
```

---

## Database Queries

### Get Exam with Relations
```typescript
const exam = await prisma.exam.findUnique({
  where: { id },
  include: {
    academicYear: true,
    class: {
      include: {
        subjects: true,
      },
    },
    schedules: true,
    results: {
      include: {
        student: true,
        subject: true,
      },
    },
  },
});
```

### Get Students for Grade Entry
```typescript
const students = await prisma.student.findMany({
  where: {
    classId: exam.classId,
    status: 'ACTIVE',
  },
  orderBy: {
    rollNo: 'asc',
  },
});
```

### Upsert Result
```typescript
const result = await prisma.examResult.upsert({
  where: {
    examId_studentId_subjectId: {
      examId,
      studentId,
      subjectId,
    },
  },
  update: { marksObtained, grade, isAbsent },
  create: { examId, studentId, subjectId, marksObtained, grade, isAbsent },
});
```

---

## Exam Types

```typescript
type ExamType =
  | 'UNIT_TEST'
  | 'MID_TERM'
  | 'FINAL'
  | 'PRACTICAL'
  | 'ASSIGNMENT';
```

---

## Grade Scale

Default scale (customizable in DB):

| Grade | Percentage | Points |
|-------|-----------|---------|
| A+    | 90-100    | 4.0     |
| A     | 80-89     | 3.7     |
| B+    | 70-79     | 3.3     |
| B     | 60-69     | 3.0     |
| C     | 50-59     | 2.0     |
| D     | 33-49     | 1.0     |
| F     | 0-32      | 0.0     |

---

## Common Validations

### Marks Validation
```typescript
// Marks must be 0 to maxMarks
if (marks < 0 || marks > maxMarks) {
  return error;
}
```

### Date Validation
```typescript
// Start date before end date
if (startDate > endDate) {
  return error;
}

// Schedule within exam period
if (scheduleDate < examStart || scheduleDate > examEnd) {
  return error;
}
```

---

## Error Messages

```typescript
// Common errors
'Exam not found'
'Missing required fields'
'Invalid marks. Must be between 0 and {maxMarks}'
'Start date must be before end date'
'Schedule already exists for this subject'
'Cannot delete exam with existing results'
'No results found for this student'
```

---

## UI Components Usage

### ExamForm
```tsx
<ExamForm
  onSubmit={handleSubmit}
  loading={loading}
  defaultValues={exam}  // Optional for edit
/>
```

### GradeEntry
```tsx
<GradeEntry
  examId={examId}
  subjects={subjects}
  maxMarks={maxMarks}
  passingMarks={passingMarks}
/>
```

### ResultsTable
```tsx
<ResultsTable
  examId={examId}
  maxMarks={maxMarks}
  passingMarks={passingMarks}
/>
```

### ReportCard
```tsx
<ReportCard data={reportCardData} />
```

---

## URL Parameters

```typescript
// Dynamic routes
/exams/[id]                    // id = exam ID
/exams/[id]/report-card/[sid]  // sid = student ID

// Query params
?academicYearId=xxx
?classId=xxx
?examType=MID_TERM
?isPublished=true
?studentId=xxx
?subjectId=xxx
```

---

## State Management

### Common State Patterns
```typescript
// Loading state
const [loading, setLoading] = useState(false);

// Data state
const [exams, setExams] = useState<Exam[]>([]);

// Filter state
const [filters, setFilters] = useState({
  academicYear: 'all',
  class: 'all',
  type: 'all',
});

// Form state (React Hook Form)
const { register, handleSubmit, formState: { errors } } = useForm();
```

---

## Keyboard Shortcuts (Future)

```
Ctrl/Cmd + N    # New exam
Ctrl/Cmd + S    # Save grades
Ctrl/Cmd + P    # Print report card
Ctrl/Cmd + F    # Focus search
Esc             # Close modal
```

---

## Performance Tips

1. **Use pagination** for large result sets
2. **Index database** on frequently queried fields
3. **Cache grade scales** for repeated calculations
4. **Debounce search** input
5. **Lazy load** report cards
6. **Optimize images** in report cards
7. **Use React.memo** for expensive components
8. **Batch API calls** where possible

---

## Debugging

### Enable Debug Logging
```typescript
// In API route
console.log('Request params:', params);
console.log('Request body:', body);
console.log('Query result:', result);
```

### Check Network Tab
- Verify API calls are made
- Check response status codes
- Inspect response payloads

### Prisma Studio
```bash
npm run studio
# Opens at http://localhost:5555
```

---

## Testing Commands

```bash
# Development
npm run dev

# Build
npm run build

# Database
npm run db:push
npm run db:generate
npm run db:seed

# Type checking
npx tsc --noEmit
```

---

## Git Workflow

```bash
# Feature branch
git checkout -b feature/exam-module

# Add files
git add apps/web/app/api/exams/
git add apps/web/app/(dashboard)/exams/
git add apps/web/components/exams/

# Commit
git commit -m "feat: add examination & grading module"

# Push
git push origin feature/exam-module
```

---

## Environment Variables

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="secret"
```

---

## Common Issues & Fixes

### Issue: "Prisma Client not found"
```bash
npm run db:generate
```

### Issue: "Module not found"
```bash
npm install
```

### Issue: "Database connection error"
```bash
# Check DATABASE_URL in .env
# Verify database is running
```

### Issue: "Grade not calculating"
```bash
# Check grade_scales table has data
# Verify percentage calculation
```

---

## File Locations

```
API Routes:     apps/web/app/api/exams/
Pages:          apps/web/app/(dashboard)/exams/
Components:     apps/web/components/exams/
Utilities:      apps/web/lib/grade-utils.ts
Types:          apps/web/types/ (if exists)
```

---

## Related Modules

- Student Management
- Class Management
- Academic Year
- Subject Management
- User Authentication

---

## Support Resources

1. **README**: EXAM_MODULE_README.md
2. **Setup Guide**: EXAM_MODULE_SETUP.md
3. **File List**: EXAM_MODULE_FILES.md
4. **Prisma Schema**: packages/database/prisma/schema.prisma
5. **API Docs**: This file (Quick Reference)

---

## Version Info

- Module: Examination & Grading
- Version: 1.0.0
- Next.js: 14.x
- React: 18.x
- Prisma: 5.x
