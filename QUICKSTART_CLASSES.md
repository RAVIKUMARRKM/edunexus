# Quick Start Guide: Class & Section Management Module

## Getting Started in 5 Minutes

### Prerequisites Check

Before using the Class Management Module, ensure you have:

1. ✅ Database is running (PostgreSQL/Supabase)
2. ✅ Prisma migrations are applied
3. ✅ At least one Academic Year exists
4. ✅ At least one Teacher exists (optional but recommended)

### Step 1: Verify Database Setup

```bash
# Run migrations if not already done
cd packages/database
npx prisma migrate dev

# Check if Academic Year exists
# If not, create one using Prisma Studio or API
npx prisma studio
```

### Step 2: Start the Development Server

```bash
# From project root
cd apps/web
npm run dev
```

### Step 3: Access the Module

Open your browser and navigate to:
```
http://localhost:3000/classes
```

### Step 4: Create Your First Class

1. Click the **"Add New Class"** button
2. Fill in the form:
   - Class Name: e.g., "Class 10" or "Grade 5"
   - Numeric Value: e.g., 10 (used for sorting)
   - Academic Year: Select from dropdown
   - Class Teacher: (Optional) Select a teacher
   - Room Number: (Optional) e.g., "101"
   - Capacity: e.g., 40
3. Click **"Create Class"**
4. You'll be redirected to the class list

### Step 5: Add Sections

1. Click on a class card to view details
2. Go to the **"Sections"** tab
3. Click **"Add Section"**
4. Fill in:
   - Section Name: e.g., "A", "B", "C"
   - Room Number: (Optional)
   - Capacity: e.g., 40
5. Click **"Create Section"**

### Step 6: Add Subjects

1. Still in class details, go to **"Subjects"** tab
2. Click **"Add Subject"**
3. Fill in:
   - Subject Name: e.g., "Mathematics"
   - Subject Code: e.g., "MATH101"
   - Type: Theory/Practical/Both
   - Assign Teacher: (Optional)
   - Is Optional: Check if applicable
4. Click **"Create Subject"**

### Step 7: Create Timetable

1. From class details, click on a section's **"View Timetable"** button
2. Select a section from the dropdown
3. Click **"Add Slot"**
4. Fill in:
   - Subject: Select from dropdown
   - Teacher: Auto-populated based on subject
   - Day of Week: Monday-Saturday
   - Start Time: e.g., "09:00"
   - End Time: e.g., "09:45"
   - Room Number: (Optional)
5. Click **"Add Slot"**
6. Repeat for all time slots

## API Usage Examples

### Using the API Client

```typescript
import { classesAPI } from '@/lib/api-client';

// List all classes
const classes = await classesAPI.list();

// Get a specific class
const classData = await classesAPI.get('class_id');

// Create a new class
const newClass = await classesAPI.create({
  name: 'Class 10',
  numericValue: 10,
  academicYearId: 'year_id',
  capacity: 40,
});

// Add a section
const section = await classesAPI.sections.create('class_id', {
  name: 'A',
  capacity: 40,
});

// Add a subject
const subject = await classesAPI.subjects.create('class_id', {
  name: 'Mathematics',
  code: 'MATH101',
  type: 'THEORY',
  teacherId: 'teacher_id',
});
```

### Using with React Query

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesAPI } from '@/lib/api-client';

function MyComponent() {
  const queryClient = useQueryClient();

  // Fetch classes
  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classesAPI.list(),
  });

  // Create class mutation
  const createMutation = useMutation({
    mutationFn: (data) => classesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
      toast.success('Class created successfully');
    },
  });

  // Use in your component
  const handleCreate = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    // Your JSX
  );
}
```

### Direct API Calls

```typescript
// GET all classes
const response = await fetch('/api/classes');
const classes = await response.json();

// POST create class
const response = await fetch('/api/classes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Class 10',
    numericValue: 10,
    academicYearId: 'year_id',
    capacity: 40,
  }),
});
const newClass = await response.json();

// GET class with details
const response = await fetch('/api/classes/class_id');
const classData = await response.json();

// PUT update class
const response = await fetch('/api/classes/class_id', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Class 10-A',
    capacity: 45,
  }),
});

// DELETE class
const response = await fetch('/api/classes/class_id', {
  method: 'DELETE',
});
```

## Component Usage

### Using ClassCard

```tsx
import { ClassCard } from '@/components/classes';

function ClassList({ classes }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classData) => (
        <ClassCard key={classData.id} classData={classData} />
      ))}
    </div>
  );
}
```

### Using ClassForm

```tsx
import { ClassForm } from '@/components/classes';

function CreateClassPage() {
  const handleSuccess = () => {
    router.push('/classes');
  };

  return (
    <ClassForm
      academicYears={academicYears}
      teachers={teachers}
      onSuccess={handleSuccess}
    />
  );
}
```

### Using TimetableGrid

```tsx
import { TimetableGrid } from '@/components/classes';

function TimetablePage() {
  const handleEdit = (slot) => {
    // Open edit dialog
  };

  const handleDelete = (slotId) => {
    // Delete slot
  };

  return (
    <TimetableGrid
      slots={timetableSlots}
      onEdit={handleEdit}
      onDelete={handleDelete}
      editable={true}
    />
  );
}
```

## Common Tasks

### Task 1: Get All Classes for Current Academic Year

```typescript
// Option 1: Using API client
const classes = await classesAPI.list({
  academicYearId: currentYearId,
});

// Option 2: Using fetch
const response = await fetch(`/api/classes?academicYearId=${currentYearId}`);
const classes = await response.json();
```

### Task 2: Create a Complete Class Setup

```typescript
// 1. Create class
const newClass = await classesAPI.create({
  name: 'Class 10',
  numericValue: 10,
  academicYearId: yearId,
  classTeacherId: teacherId,
  capacity: 40,
});

// 2. Create sections
const sectionA = await classesAPI.sections.create(newClass.id, {
  name: 'A',
  capacity: 40,
});

const sectionB = await classesAPI.sections.create(newClass.id, {
  name: 'B',
  capacity: 40,
});

// 3. Create subjects
const math = await classesAPI.subjects.create(newClass.id, {
  name: 'Mathematics',
  code: 'MATH101',
  type: 'THEORY',
  teacherId: mathTeacherId,
});

const physics = await classesAPI.subjects.create(newClass.id, {
  name: 'Physics',
  code: 'PHY101',
  type: 'BOTH',
  teacherId: physicsTeacherId,
});
```

### Task 3: Update Timetable in Bulk

```typescript
const slots = [
  {
    subjectId: mathId,
    teacherId: mathTeacherId,
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '09:45',
    roomNo: '101',
  },
  {
    subjectId: physicsId,
    teacherId: physicsTeacherId,
    dayOfWeek: 1,
    startTime: '09:45',
    endTime: '10:30',
    roomNo: '102',
  },
  // ... more slots
];

await classesAPI.timetable.update(classId, sectionId, slots);
```

## Troubleshooting

### Issue: "Failed to fetch classes"

**Solution:** Check if:
1. Database is running
2. Prisma client is generated (`npx prisma generate`)
3. User is authenticated
4. API route is correct

### Issue: "Cannot create class - already exists"

**Solution:** Each class name must be unique within an academic year. Either:
1. Choose a different name
2. Update the existing class instead

### Issue: "Cannot delete class with students"

**Solution:** Before deleting a class:
1. Move students to another class
2. Or remove students from the system
3. Then delete the class

### Issue: "Timetable not showing"

**Solution:** Ensure:
1. Section is selected
2. Subjects exist for the class
3. Teachers are assigned to subjects
4. Time slots have been created

### Issue: "Teacher dropdown is empty"

**Solution:**
1. Create teachers in the system first
2. Ensure teachers have status = 'ACTIVE'
3. Refresh the page

## Testing Checklist

- [ ] Can view list of classes
- [ ] Can search classes by name
- [ ] Can create a new class
- [ ] Can view class details
- [ ] Can create sections
- [ ] Can create subjects
- [ ] Can assign teachers to subjects
- [ ] Can create timetable slots
- [ ] Can view timetable by day
- [ ] Can view students in class
- [ ] Can filter students by section
- [ ] Can search students
- [ ] All forms validate correctly
- [ ] Error messages display properly
- [ ] Success toasts appear
- [ ] Loading states work
- [ ] Responsive design works on mobile

## Performance Tips

1. **Use React Query caching** - Data is automatically cached
2. **Filter on the server** - Use query parameters for large datasets
3. **Lazy load components** - Use Next.js dynamic imports if needed
4. **Optimize images** - Use Next.js Image component for photos
5. **Pagination** - Implement for large student lists (future enhancement)

## Next Steps

After mastering the basics:

1. Explore the full API documentation in `CLASS_SECTION_MODULE.md`
2. Customize components to match your design
3. Add role-based access control
4. Integrate with other modules (Students, Exams, etc.)
5. Set up automated testing

## Support

For issues or questions:
1. Check the main documentation: `CLASS_SECTION_MODULE.md`
2. Review the file structure: `CLASS_MODULE_FILES.md`
3. Check the Prisma schema for data models
4. Review the API client for available methods

## Summary

You now have a fully functional Class & Section Management Module with:
- ✅ 7 API endpoints
- ✅ 5 web pages
- ✅ 5 reusable components
- ✅ Type-safe API client
- ✅ Complete TypeScript types
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design

Happy coding!
