# Student Module - Quick Start Guide

## Getting Started

This guide will help you quickly understand and work with the Student Management Module.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd /c/Users/Ravi\ Kumar/Apps/edunexus
npm install
```

### 2. Set Up Database
```bash
cd packages/database
npm run db:generate
npm run db:push
```

### 3. Run Development Server
```bash
cd apps/web
npm run dev
```

### 4. Access Student Module
Navigate to: `http://localhost:3000/students`

---

## 📁 File Locations

### API Routes
```
apps/web/app/api/students/
├── route.ts                           # GET, POST students
├── [id]/route.ts                      # GET, PUT, DELETE student
├── [id]/attendance/route.ts           # Attendance operations
└── [id]/documents/route.ts            # Document operations
```

### Pages
```
apps/web/app/(dashboard)/students/
├── page.tsx                           # List page
├── new/page.tsx                       # Create page
└── [id]/
    ├── page.tsx                       # Profile page
    └── edit/page.tsx                  # Edit page
```

### Components
```
apps/web/components/students/
├── StudentForm.tsx                    # Form component
├── StudentCard.tsx                    # Card component
├── StudentTable.tsx                   # Table component
└── AttendanceMarker.tsx               # Attendance component
```

---

## 🔧 Common Tasks

### Adding a New Field to Student

1. **Update Prisma Schema** (`packages/database/prisma/schema.prisma`)
```prisma
model Student {
  // ... existing fields
  newField String?
}
```

2. **Run Migration**
```bash
cd packages/database
npm run db:push
```

3. **Update Validator** (`packages/shared/src/validators/index.ts`)
```typescript
export const studentSchema = z.object({
  // ... existing fields
  newField: z.string().optional(),
});
```

4. **Update Form Component** (`components/students/StudentForm.tsx`)
```typescript
<div>
  <Label htmlFor="newField">New Field</Label>
  <Input id="newField" {...register('newField')} />
</div>
```

5. **Update API Route** (`app/api/students/route.ts`)
```typescript
const student = await prisma.student.create({
  data: {
    // ... existing fields
    newField: validatedData.newField,
  },
});
```

---

### Creating a Custom Filter

**In List Page** (`app/(dashboard)/students/page.tsx`)

```typescript
// Add state
const [customFilter, setCustomFilter] = useState('');

// Update query
const { data } = useQuery({
  queryKey: ['students', { customFilter }],
  queryFn: async () => {
    const params = new URLSearchParams();
    if (customFilter) params.append('custom', customFilter);
    // ... rest of query
  },
});

// Add UI
<select
  value={customFilter}
  onChange={(e) => setCustomFilter(e.target.value)}
>
  <option value="">All</option>
  <option value="value1">Option 1</option>
</select>
```

**In API Route** (`app/api/students/route.ts`)

```typescript
const custom = searchParams.get('custom');

if (custom) {
  where.customField = custom;
}
```

---

### Adding a New Status Type

1. **Update Prisma Enum**
```prisma
enum StudentStatus {
  ACTIVE
  INACTIVE
  LEFT
  GRADUATED
  SUSPENDED
  NEW_STATUS  // Add this
}
```

2. **Run Migration**
```bash
npm run db:push
```

3. **Update Badge Colors** (in components where status is displayed)
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'NEW_STATUS':
      return 'blue';
    // ... existing cases
  }
};
```

---

## 🧪 Testing API Endpoints

### Using curl

**List Students**
```bash
curl http://localhost:3000/api/students
```

**Create Student**
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "admissionNo": "ADM001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2010-01-15",
    "gender": "MALE",
    "classId": "class_id",
    "sectionId": "section_id"
  }'
```

**Get Student**
```bash
curl http://localhost:3000/api/students/{id}
```

**Mark Attendance**
```bash
curl -X POST http://localhost:3000/api/students/{id}/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "status": "PRESENT"
  }'
```

---

## 🎨 Customizing UI

### Change Card Layout

Edit `components/students/StudentCard.tsx`:

```typescript
// Change from grid to flex layout
<div className="flex flex-col gap-4">
  {/* Your custom layout */}
</div>
```

### Add Custom Column to Table

Edit `components/students/StudentTable.tsx`:

```typescript
// Add header
<TableHead>Custom Column</TableHead>

// Add cell
<TableCell>{student.customField}</TableCell>
```

### Modify Form Layout

Edit `components/students/StudentForm.tsx`:

```typescript
// Change grid columns
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Form fields */}
</div>
```

---

## 🐛 Debugging Tips

### Check API Response
```typescript
const { data, error } = useQuery({
  queryKey: ['students'],
  queryFn: async () => {
    const response = await fetch('/api/students');
    const data = await response.json();
    console.log('API Response:', data); // Add this
    return data;
  },
});
```

### Inspect Form Values
```typescript
const form = useForm({
  // ...
});

// Add this to see form values
console.log('Form values:', form.watch());
```

### Check Database Records
```bash
cd packages/database
npm run studio
```

Then navigate to `http://localhost:5555` to view database in Prisma Studio.

---

## 🔍 Common Issues & Solutions

### Issue: "Unauthorized" error
**Solution**: Ensure NextAuth session is active
```typescript
// Check session in browser console
console.log(await fetch('/api/auth/session').then(r => r.json()));
```

### Issue: Form validation fails
**Solution**: Check Zod schema matches form data
```typescript
// Test validation manually
import { studentSchema } from '@edunexus/shared';
const result = studentSchema.safeParse(formData);
console.log(result);
```

### Issue: Data not updating
**Solution**: Invalidate React Query cache
```typescript
const queryClient = useQueryClient();
queryClient.invalidateQueries(['students']);
```

### Issue: Prisma client errors
**Solution**: Regenerate Prisma client
```bash
cd packages/database
npm run db:generate
```

---

## 📊 Database Queries

### Get All Students with Relations
```typescript
const students = await prisma.student.findMany({
  include: {
    user: true,
    class: true,
    section: true,
    parents: {
      include: {
        parent: true,
      },
    },
  },
});
```

### Get Attendance Statistics
```typescript
const stats = await prisma.studentAttendance.groupBy({
  by: ['status'],
  where: {
    studentId: studentId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  },
  _count: true,
});
```

### Search Students
```typescript
const students = await prisma.student.findMany({
  where: {
    OR: [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { admissionNo: { contains: search } },
    ],
  },
});
```

---

## 🎯 Best Practices

### 1. Always Validate Input
```typescript
const validatedData = studentSchema.parse(body);
```

### 2. Handle Errors Gracefully
```typescript
try {
  // operation
} catch (error) {
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  );
}
```

### 3. Use Loading States
```typescript
{isLoading ? (
  <Skeleton className="h-12 w-full" />
) : (
  <StudentTable students={data} />
)}
```

### 4. Provide User Feedback
```typescript
toast({
  title: 'Success',
  description: 'Student created successfully',
});
```

### 5. Optimize Database Queries
```typescript
// Only include what you need
include: {
  user: {
    select: {
      email: true,
      phone: true,
    },
  },
}
```

---

## 🔗 Useful Links

- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **TanStack Query**: https://tanstack.com/query
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Tailwind CSS**: https://tailwindcss.com

---

## 📝 Code Snippets

### Add Toast Notification
```typescript
import { useToast } from '@/components/ui/toast';

const { toast } = useToast();

toast({
  title: 'Success',
  description: 'Operation completed',
});
```

### Fetch with Error Handling
```typescript
const fetchData = async () => {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    return response.json();
  } catch (error) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  }
};
```

### Create Custom Hook
```typescript
export function useStudents(filters: FilterOptions) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/students?${params}`);
      return response.json();
    },
  });
}
```

---

## 🚦 Development Workflow

1. **Make Changes**: Edit files in your IDE
2. **Test Locally**: Run dev server and test changes
3. **Check Types**: Run `npm run type-check`
4. **Format Code**: Run `npm run format`
5. **Commit Changes**: Use meaningful commit messages
6. **Push to Repo**: Push to feature branch
7. **Create PR**: Submit for review

---

## 📱 Mobile Testing

### Test Responsive Design
- Use Chrome DevTools device emulation
- Test on actual mobile devices
- Check touch interactions
- Verify text is readable
- Ensure buttons are touch-friendly (min 44x44px)

---

## 🎓 Learning Resources

### For Beginners
1. Start with the list page (`students/page.tsx`)
2. Understand the StudentTable component
3. Learn how TanStack Query works
4. Study the API route structure

### For Advanced
1. Implement bulk operations
2. Add real-time updates with WebSockets
3. Optimize performance with React.memo
4. Implement advanced caching strategies

---

## 💡 Tips & Tricks

1. **Use TypeScript**: Leverage type safety
2. **Console Logs**: Use them liberally during development
3. **React DevTools**: Install and use for debugging
4. **Prisma Studio**: Great for database inspection
5. **Network Tab**: Monitor API calls in browser
6. **Hot Reload**: Next.js updates on save

---

## 🆘 Getting Help

1. Check documentation in `/docs/STUDENT_MODULE.md`
2. Review code comments in components
3. Search for similar implementations in codebase
4. Check Prisma schema for data structure
5. Review validation schemas for requirements

---

**Happy Coding! 🎉**
