# Teacher Module - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- pnpm installed globally

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd C:/Users/Ravi\ Kumar/Apps/edunexus
pnpm install
```

### 2. Configure Environment
Create `.env` file in `apps/web/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/edunexus"
DIRECT_URL="postgresql://user:password@localhost:5432/edunexus"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Setup Database
```bash
cd packages/database
pnpm db:generate
pnpm db:push
```

### 4. Start Development Server
```bash
cd apps/web
pnpm dev
```

### 5. Access Application
Open browser: http://localhost:3000/teachers

## Quick Test Workflow

### Test 1: Create a Teacher (2 minutes)
1. Click "Add Teacher" button
2. Fill required fields:
   - Email: teacher@test.com
   - Password: test123
   - First Name: John
   - Last Name: Doe
   - Date of Birth: Select date
   - Gender: Select gender
   - Qualification: B.Ed
   - Basic Salary: 50000
3. Click "Create Teacher"
4. Should redirect to teacher profile

### Test 2: View Teacher List (1 minute)
1. Navigate to /teachers
2. See newly created teacher
3. Try search: Type "John"
4. Try filter: Select "Active" status
5. Switch between grid and table view

### Test 3: Edit Teacher (2 minutes)
1. Click on teacher card
2. Click "Edit Profile" button
3. Update any field (e.g., phone number)
4. Click "Update Teacher"
5. Verify changes on profile page

### Test 4: Assign Subject (2 minutes)
1. On teacher profile, go to "Subjects" tab
2. Click "Assign Subject"
3. Select a subject from dropdown
4. Click "Assign"
5. See subject appear in list

### Test 5: Mark Attendance (1 minute)
1. Use API directly or build attendance UI
2. POST to /api/teachers/{id}/attendance
3. View in "Attendance" tab

## API Testing with curl

### Create Teacher
```bash
curl -X POST http://localhost:3000/api/teachers \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher2@test.com",
    "password": "test123",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1995-05-15",
    "gender": "FEMALE",
    "qualification": "M.Ed",
    "basicSalary": 60000
  }'
```

### Get All Teachers
```bash
curl http://localhost:3000/api/teachers
```

### Get Single Teacher
```bash
curl http://localhost:3000/api/teachers/{teacher-id}
```

### Mark Attendance
```bash
curl -X POST http://localhost:3000/api/teachers/{teacher-id}/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-23",
    "status": "PRESENT",
    "inTime": "2024-01-23T09:00:00",
    "outTime": "2024-01-23T17:00:00"
  }'
```

## File Locations Reference

### Need to modify forms?
`apps/web/components/teachers/TeacherForm.tsx`

### Need to change API logic?
`apps/web/app/api/teachers/route.ts`

### Need to update validation?
`apps/web/lib/validations/teacher.ts`

### Need to modify list page?
`apps/web/app/(dashboard)/teachers/page.tsx`

### Need to change profile page?
`apps/web/app/(dashboard)/teachers/[id]/page.tsx`

## Common Issues & Solutions

### Issue: "Failed to fetch teachers"
**Solution**: Check DATABASE_URL in .env and ensure database is running

### Issue: "Teacher with this email already exists"
**Solution**: Use a different email or delete existing teacher

### Issue: "Cannot delete teacher with active assignments"
**Solution**: Remove subject assignments first, then delete

### Issue: Page not found
**Solution**: Ensure you're in the (dashboard) route group

### Issue: Validation errors
**Solution**: Check all required fields are filled correctly

## Project Structure Overview

```
edunexus/
├── apps/web/
│   ├── app/
│   │   ├── api/teachers/          ← API routes
│   │   └── (dashboard)/teachers/  ← Pages
│   ├── components/teachers/       ← Reusable components
│   └── lib/validations/           ← Form validation
└── packages/database/
    └── prisma/schema.prisma       ← Database schema
```

## Key URLs

- Teachers List: http://localhost:3000/teachers
- Add Teacher: http://localhost:3000/teachers/new
- Teacher Profile: http://localhost:3000/teachers/[id]
- Edit Teacher: http://localhost:3000/teachers/[id]/edit

## Development Tips

1. **Hot Reload**: Changes to files auto-reload browser
2. **Type Safety**: TypeScript will catch errors before runtime
3. **Database Changes**: Run `pnpm db:push` after schema changes
4. **Console Logs**: Check browser console for client errors
5. **Server Logs**: Check terminal for API errors

## Next Features to Add

1. Photo upload functionality
2. Bulk import from CSV
3. Email notifications
4. Advanced reports
5. Performance analytics

## Getting Help

1. Check `TEACHER_MODULE_README.md` for detailed docs
2. Check `TEACHER_MODULE_SUMMARY.md` for implementation details
3. Review Prisma schema for database structure
4. Inspect component props and types
5. Check browser console for errors

## Production Deployment

### Build for Production
```bash
cd apps/web
pnpm build
```

### Run Production Server
```bash
pnpm start
```

### Environment Variables (Production)
Add to your hosting platform:
- DATABASE_URL
- DIRECT_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

## Success Criteria

✅ Can create new teachers
✅ Can view teacher list
✅ Can search and filter
✅ Can edit teacher info
✅ Can assign subjects
✅ Can view teacher profile
✅ API returns correct data
✅ Validation works properly
✅ No console errors

## Time Estimates

- Setup: 5 minutes
- Basic testing: 10 minutes
- Full feature testing: 30 minutes
- API testing: 15 minutes
- Customization: Varies

## Module Status: ✅ READY FOR USE

All components are implemented and functional. Start testing!

---

**Last Updated**: January 23, 2024
**Module Version**: 1.0.0
**Author**: Claude (Anthropic)
