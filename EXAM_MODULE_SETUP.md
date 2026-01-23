# Examination & Grading Module - Setup Guide

## Prerequisites

Before using the Examination & Grading module, ensure you have:

1. Database schema migrated (Prisma models deployed)
2. At least one Academic Year created
3. At least one Class created and linked to the Academic Year
4. Subjects created for the Class
5. Students enrolled in the Class
6. Grade Scale data populated (optional but recommended)

## Initial Setup

### 1. Seed Grade Scale Data (Recommended)

Run this in your database or create a seed script:

```sql
INSERT INTO grade_scales (id, name, min_percent, max_percent, grade_point, remarks, created_at) VALUES
  ('gs1', 'A+', 90, 100, 4.0, 'Outstanding', NOW()),
  ('gs2', 'A', 80, 89, 3.7, 'Excellent', NOW()),
  ('gs3', 'B+', 70, 79, 3.3, 'Very Good', NOW()),
  ('gs4', 'B', 60, 69, 3.0, 'Good', NOW()),
  ('gs5', 'C', 50, 59, 2.0, 'Average', NOW()),
  ('gs6', 'D', 33, 49, 1.0, 'Pass', NOW()),
  ('gs7', 'F', 0, 32, 0.0, 'Fail', NOW());
```

Or using Prisma:

```typescript
// prisma/seed.ts
const gradeScales = [
  { name: 'A+', minPercent: 90, maxPercent: 100, gradePoint: 4.0, remarks: 'Outstanding' },
  { name: 'A', minPercent: 80, maxPercent: 89, gradePoint: 3.7, remarks: 'Excellent' },
  { name: 'B+', minPercent: 70, maxPercent: 79, gradePoint: 3.3, remarks: 'Very Good' },
  { name: 'B', minPercent: 60, maxPercent: 69, gradePoint: 3.0, remarks: 'Good' },
  { name: 'C', minPercent: 50, maxPercent: 59, gradePoint: 2.0, remarks: 'Average' },
  { name: 'D', minPercent: 33, maxPercent: 49, gradePoint: 1.0, remarks: 'Pass' },
  { name: 'F', minPercent: 0, maxPercent: 32, gradePoint: 0.0, remarks: 'Fail' },
];

await prisma.gradeScale.createMany({ data: gradeScales });
```

### 2. Verify Database Setup

Ensure the following tables exist and have data:
- `academic_years` - At least one current academic year
- `classes` - Classes linked to academic year
- `subjects` - Subjects for each class
- `students` - Students enrolled in classes
- `grade_scales` - Grade scale configuration

### 3. Run Database Migration

If not already done, run:

```bash
cd packages/database
npm run db:push
```

## Testing the Module

### Step 1: Create an Exam

1. Start the development server:
   ```bash
   cd apps/web
   npm run dev
   ```

2. Navigate to `http://localhost:3000/exams`

3. Click "Create Exam" button

4. Fill in the exam details:
   - **Name**: Mid Term Examination 2024
   - **Exam Type**: Mid Term
   - **Academic Year**: Select current year
   - **Class**: Select a class
   - **Start Date**: 2024-10-01
   - **End Date**: 2024-10-15
   - **Max Marks**: 100
   - **Passing Marks**: 33
   - **Published**: Leave unchecked (Draft)

5. Click "Create Exam"

### Step 2: Create Exam Schedule

1. On the exam details page, go to "Schedule" tab

2. Click "Add Schedule"

3. For each subject:
   - Select subject
   - Set date (between exam start and end dates)
   - Set start time (e.g., 09:00)
   - Set end time (e.g., 12:00)
   - Optional: Set room number

4. Click "Add Schedule"

5. Repeat for all subjects

### Step 3: Enter Grades

1. Navigate to "Grade Entry" tab or click "Go to Grade Entry"

2. Select a subject from the dropdown

3. For each student:
   - Enter marks (0 to max marks)
   - Or check "Absent" checkbox
   - Optionally add remarks

4. Click "Save Grades"

5. Repeat for all subjects

### Step 4: View Results

1. Go to "Results" tab or click "View All Results"

2. View the results table with:
   - Student-wise performance
   - Total marks and percentage
   - Overall grade
   - Pass/fail status

3. Use filters to search/filter results:
   - Search by student name or roll number
   - Filter by subject
   - Filter by pass/fail status

4. Export results if needed

### Step 5: Generate Report Card

1. Navigate to `/exams/report-cards`

2. Select the exam from dropdown

3. Select a student from dropdown

4. Click "Generate Report Card"

5. Review the report card:
   - Student details
   - Subject-wise marks and grades
   - Overall performance summary
   - Class rank

6. Click "Print" to print the report card

### Step 6: Publish Exam

1. Go back to exam details page

2. Click "Publish" button

3. Confirm publication

4. Now students/parents can view their results

## API Testing

You can test the API endpoints using tools like Postman or curl:

### Create an Exam
```bash
curl -X POST http://localhost:3000/api/exams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Final Exam 2024",
    "academicYearId": "year_id",
    "classId": "class_id",
    "examType": "FINAL",
    "startDate": "2024-12-01",
    "endDate": "2024-12-15",
    "maxMarks": 100,
    "passingMarks": 33
  }'
```

### Get All Exams
```bash
curl http://localhost:3000/api/exams
```

### Create Schedule
```bash
curl -X POST http://localhost:3000/api/exams/{exam_id}/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "subjectId": "subject_id",
    "date": "2024-12-05",
    "startTime": "09:00",
    "endTime": "12:00",
    "roomNo": "Room 101"
  }'
```

### Save Grades
```bash
curl -X POST http://localhost:3000/api/exams/{exam_id}/results \
  -H "Content-Type: application/json" \
  -d '{
    "results": [
      {
        "studentId": "student_id",
        "subjectId": "subject_id",
        "marksObtained": 85,
        "isAbsent": false,
        "remarks": "Good"
      }
    ]
  }'
```

### Get Report Card
```bash
curl http://localhost:3000/api/exams/{exam_id}/report-card/{student_id}
```

## Common Issues & Solutions

### Issue: "Exam not found" error
**Solution**: Ensure the exam ID is correct and the exam exists in the database.

### Issue: "No students found" in grade entry
**Solution**:
1. Check if students are enrolled in the class
2. Verify students have status "ACTIVE"
3. Ensure the exam is linked to the correct class

### Issue: "Invalid marks" error when saving grades
**Solution**: Ensure marks are between 0 and the max marks configured for the exam.

### Issue: "Schedule already exists" error
**Solution**: Each subject can have only one schedule per exam. Update the existing schedule instead.

### Issue: Report card shows "No results found"
**Solution**:
1. Ensure grades have been entered for the student
2. Check if the exam is published
3. Verify the student ID is correct

### Issue: Grades not calculating correctly
**Solution**:
1. Check if grade scale data exists in database
2. Verify grade scale percentages are configured correctly
3. Ensure marks are saved as numbers, not strings

## File Structure

```
apps/web/
├── app/
│   ├── api/exams/
│   │   ├── route.ts                                    # List/Create exams
│   │   └── [id]/
│   │       ├── route.ts                                # Get/Update/Delete exam
│   │       ├── schedule/route.ts                       # Exam schedules
│   │       ├── results/route.ts                        # Exam results
│   │       ├── students/route.ts                       # Students in exam class
│   │       └── report-card/[studentId]/route.ts        # Report card
│   │
│   └── (dashboard)/exams/
│       ├── page.tsx                                    # Exams list
│       ├── new/page.tsx                                # Create exam
│       ├── [id]/
│       │   ├── page.tsx                                # Exam details
│       │   ├── grades/page.tsx                         # Grade entry
│       │   └── results/page.tsx                        # Results view
│       └── report-cards/page.tsx                       # Report card generator
│
└── components/exams/
    ├── ExamForm.tsx                                    # Exam form component
    ├── ExamScheduleForm.tsx                            # Schedule form
    ├── GradeEntry.tsx                                  # Grade entry table
    ├── ResultsTable.tsx                                # Results table
    └── ReportCard.tsx                                  # Report card component
```

## Next Steps

After setting up the module:

1. **Configure Grade Scales**: Customize grade scales according to your institution's requirements

2. **Set Up Permissions**: Add role-based access control for different user types

3. **Create Exam Templates**: Create common exam configurations for reuse

4. **Set Up Notifications**: Implement email notifications for result publication

5. **Add Analytics**: Create dashboards for exam performance analytics

6. **Bulk Import**: Implement Excel import for grades

7. **Mobile Access**: Ensure mobile responsiveness for all pages

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the API endpoint documentation
3. Check the Prisma schema for data models
4. Verify all prerequisites are met

## Environment Variables

Ensure these are set in your `.env` file:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## Development Commands

```bash
# Start development server
npm run dev

# Run database migrations
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed database
npm run db:seed

# Build for production
npm run build

# Start production server
npm run start
```

## Production Deployment

Before deploying to production:

1. Set `isPublished: false` as default for new exams
2. Add proper authentication checks
3. Enable audit logging
4. Set up database backups
5. Configure CDN for static assets
6. Enable rate limiting on API routes
7. Add monitoring and error tracking

## Module Integration

This module integrates with:
- **Student Management**: Fetches student data
- **Class Management**: Uses class and subject data
- **Academic Year**: Links exams to academic years
- **User Management**: Uses teacher/staff data for authentication

Make sure these modules are properly set up before using the exam module.
