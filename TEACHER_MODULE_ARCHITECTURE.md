# Teacher Management Module - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Teachers    │  │ Teacher     │  │ Teacher     │             │
│  │ List Page   │  │ Profile     │  │ Form Pages  │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                 │                 │                    │
│         └─────────────────┴─────────────────┘                    │
│                           │                                      │
│         ┌─────────────────▼─────────────────┐                   │
│         │    React Components Layer          │                   │
│         ├────────────────────────────────────┤                   │
│         │ • TeacherTable                     │                   │
│         │ • TeacherCard                      │                   │
│         │ • TeacherForm                      │                   │
│         │ • SubjectAssignment                │                   │
│         └─────────────────┬──────────────────┘                   │
│                           │                                      │
│         ┌─────────────────▼─────────────────┐                   │
│         │   Data Management Layer            │                   │
│         ├────────────────────────────────────┤                   │
│         │ • TanStack Query (Caching)         │                   │
│         │ • React Hook Form (Forms)          │                   │
│         │ • Zod (Validation)                 │                   │
│         └─────────────────┬──────────────────┘                   │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                      Next.js API Layer                            │
├───────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ /api/teachers  │  │ /api/teachers  │  │ /api/teachers  │     │
│  │                │  │ /[id]          │  │ /[id]/         │     │
│  │ • GET (list)   │  │ • GET (single) │  │ attendance     │     │
│  │ • POST (create)│  │ • PUT (update) │  │ • GET          │     │
│  │                │  │ • DELETE       │  │ • POST         │     │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘     │
│           │                   │                   │              │
│           └───────────────────┴───────────────────┘              │
│                               │                                  │
│           ┌───────────────────▼───────────────────┐              │
│           │    Business Logic Layer                │              │
│           ├────────────────────────────────────────┤              │
│           │ • Input validation                     │              │
│           │ • Employee ID generation               │              │
│           │ • Password hashing                     │              │
│           │ • Relationship validation              │              │
│           │ • Transaction handling                 │              │
│           └───────────────────┬────────────────────┘              │
└───────────────────────────────┼──────────────────────────────────┘
                                │
                        Prisma ORM
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                       Database Layer                              │
├───────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                              │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Tables:                                                  │    │
│  │  • teachers                                               │    │
│  │  • users                                                  │    │
│  │  • teacher_attendances                                    │    │
│  │  • subject_assignments                                    │    │
│  │  • departments                                            │    │
│  │  • subjects                                               │    │
│  │  • leave_requests                                         │    │
│  │  • classes                                                │    │
│  └──────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Create Teacher Flow

```
User                Component           API                Database
 │                     │                 │                    │
 │   Fill Form         │                 │                    │
 ├────────────────────>│                 │                    │
 │                     │                 │                    │
 │   Submit            │                 │                    │
 ├────────────────────>│                 │                    │
 │                     │                 │                    │
 │                     │ POST /api/      │                    │
 │                     │ teachers        │                    │
 │                     ├────────────────>│                    │
 │                     │                 │                    │
 │                     │                 │ Validate Input     │
 │                     │                 │ Hash Password      │
 │                     │                 │ Generate EmpID     │
 │                     │                 │                    │
 │                     │                 │ Create User        │
 │                     │                 ├───────────────────>│
 │                     │                 │                    │
 │                     │                 │ Create Teacher     │
 │                     │                 ├───────────────────>│
 │                     │                 │                    │
 │                     │                 │ Return Teacher     │
 │                     │                 │<───────────────────┤
 │                     │                 │                    │
 │                     │ Teacher Data    │                    │
 │                     │<────────────────┤                    │
 │                     │                 │                    │
 │   Redirect to       │                 │                    │
 │   Profile           │                 │                    │
 │<────────────────────┤                 │                    │
 │                     │                 │                    │
```

### 2. List Teachers Flow

```
User            Component         TanStack Query        API         Database
 │                 │                    │                │              │
 │  Visit Page     │                    │                │              │
 ├────────────────>│                    │                │              │
 │                 │                    │                │              │
 │                 │ Fetch Teachers     │                │              │
 │                 ├───────────────────>│                │              │
 │                 │                    │                │              │
 │                 │                    │ Check Cache    │              │
 │                 │                    │                │              │
 │                 │                    │ Cache Miss     │              │
 │                 │                    │                │              │
 │                 │                    │ GET /api/      │              │
 │                 │                    │ teachers       │              │
 │                 │                    ├───────────────>│              │
 │                 │                    │                │              │
 │                 │                    │                │ Query DB     │
 │                 │                    │                ├─────────────>│
 │                 │                    │                │              │
 │                 │                    │                │ Teachers[]   │
 │                 │                    │                │<─────────────┤
 │                 │                    │                │              │
 │                 │                    │ Teachers[]     │              │
 │                 │                    │<───────────────┤              │
 │                 │                    │                │              │
 │                 │                    │ Store Cache    │              │
 │                 │                    │                │              │
 │                 │ Teachers[]         │                │              │
 │                 │<───────────────────┤                │              │
 │                 │                    │                │              │
 │  Display List   │                    │                │              │
 │<────────────────┤                    │                │              │
 │                 │                    │                │              │
```

### 3. Subject Assignment Flow

```
User            Component           API              Database
 │                 │                  │                 │
 │  Click Assign   │                  │                 │
 ├────────────────>│                  │                 │
 │                 │                  │                 │
 │                 │ Open Dialog      │                 │
 │<────────────────┤                  │                 │
 │                 │                  │                 │
 │  Select Subject │                  │                 │
 ├────────────────>│                  │                 │
 │                 │                  │                 │
 │  Submit         │                  │                 │
 ├────────────────>│                  │                 │
 │                 │                  │                 │
 │                 │ POST /api/       │                 │
 │                 │ teachers/[id]/   │                 │
 │                 │ subjects         │                 │
 │                 ├─────────────────>│                 │
 │                 │                  │                 │
 │                 │                  │ Validate        │
 │                 │                  │ Check Duplicate │
 │                 │                  │                 │
 │                 │                  │ Create Record   │
 │                 │                  ├────────────────>│
 │                 │                  │                 │
 │                 │                  │ Assignment      │
 │                 │                  │<────────────────┤
 │                 │                  │                 │
 │                 │ Assignment       │                 │
 │                 │<─────────────────┤                 │
 │                 │                  │                 │
 │                 │ Invalidate Cache │                 │
 │                 │ Update UI        │                 │
 │                 │                  │                 │
 │  Show Success   │                  │                 │
 │<────────────────┤                  │                 │
 │                 │                  │                 │
```

## Component Hierarchy

```
TeachersPage (Main Container)
├── Header
│   ├── Title & Description
│   └── Add Teacher Button
│
├── Filters Section
│   ├── Search Input
│   ├── Status Select
│   ├── Department Select
│   └── View Toggle (Grid/Table)
│
├── Statistics Cards
│   ├── Total Teachers
│   ├── Active Count
│   ├── On Leave Count
│   └── Inactive Count
│
└── Content Area
    ├── Grid View
    │   └── TeacherCard[]
    │       ├── Avatar
    │       ├── Basic Info
    │       ├── Contact Details
    │       ├── Subject Badges
    │       └── Action Buttons
    │
    └── Table View
        └── TeacherTable
            ├── Search Input
            ├── Table Header
            ├── Table Body
            │   └── Teacher Rows[]
            │       ├── Avatar + Name
            │       ├── Department
            │       ├── Qualification
            │       ├── Status Badge
            │       └── Actions Menu
            └── Pagination Controls
```

## State Management

```
┌────────────────────────────────────────────────────────┐
│                   Global State                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  TanStack Query Cache                                  │
│  ├── teachers                                          │
│  │   ├── key: ['teachers', filters]                    │
│  │   ├── staleTime: 60s                                │
│  │   └── data: { teachers[], pagination }             │
│  │                                                      │
│  ├── teacher-[id]                                      │
│  │   ├── key: ['teacher', id]                          │
│  │   ├── staleTime: 60s                                │
│  │   └── data: Teacher                                 │
│  │                                                      │
│  ├── teacher-subjects-[id]                             │
│  │   ├── key: ['teacher-subjects', id]                 │
│  │   ├── staleTime: 60s                                │
│  │   └── data: SubjectAssignment[]                     │
│  │                                                      │
│  ├── departments                                       │
│  │   ├── key: ['departments']                          │
│  │   └── data: Department[]                            │
│  │                                                      │
│  └── subjects                                          │
│      ├── key: ['subjects']                             │
│      └── data: Subject[]                               │
│                                                        │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                 Component State                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  TeachersPage                                          │
│  ├── view: 'grid' | 'table'                            │
│  ├── search: string                                    │
│  ├── status: string                                    │
│  └── departmentId: string                              │
│                                                        │
│  TeacherForm                                           │
│  ├── formData: TeacherFormValues                       │
│  ├── errors: FieldErrors                               │
│  └── isSubmitting: boolean                             │
│                                                        │
│  SubjectAssignment                                     │
│  ├── isOpen: boolean                                   │
│  └── selectedSubject: string                           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌────────────┐         ┌────────────┐
│    User    │1      1 │  Teacher   │
│────────────│─────────│────────────│
│ id         │         │ id         │
│ email      │         │ userId     │
│ password   │         │ employeeId │
│ name       │         │ firstName  │
│ role       │         │ lastName   │
└────────────┘         │ ...        │
                       └──────┬─────┘
                              │
                       ┌──────┴──────┐
                       │             │
                 0..1  │             │ 0..n
              ┌────────▼───┐   ┌─────▼──────────┐
              │   Class    │   │ SubjectAssign  │
              │────────────│   │ ment           │
              │ id         │   │────────────────│
              │ name       │   │ id             │
              │ teacherId  │   │ teacherId      │
              └────────────┘   │ subjectId      │
                               └────────┬───────┘
                                        │
                                   1    │ 1
                               ┌────────▼────────┐
                               │    Subject      │
                               │─────────────────│
                               │ id              │
                               │ name            │
                               │ code            │
                               │ classId         │
                               └─────────────────┘

┌────────────┐
│  Teacher   │
│────────────│
│ id         │
└──────┬─────┘
       │
       │ 1..n
       │
┌──────▼────────────┐
│ TeacherAttendance │
│───────────────────│
│ id                │
│ teacherId         │
│ date              │
│ status            │
│ inTime            │
│ outTime           │
└───────────────────┘

┌────────────┐
│  Teacher   │
│────────────│
│ id         │
└──────┬─────┘
       │
       │ 1..n
       │
┌──────▼─────────┐
│ LeaveRequest   │
│────────────────│
│ id             │
│ teacherId      │
│ leaveType      │
│ startDate      │
│ endDate        │
│ status         │
└────────────────┘

┌────────────┐         ┌────────────┐
│  Teacher   │n     0..1│ Department │
│────────────│──────────│────────────│
│ id         │          │ id         │
│ departmentId│         │ name       │
└────────────┘          │ code       │
                        └────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│              Security Layers                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Authentication Layer                            │
│     • NextAuth.js session management                │
│     • Role-based access control                     │
│     • JWT tokens                                    │
│                                                     │
│  2. Input Validation Layer                          │
│     • Client-side: Zod schemas                      │
│     • Server-side: API validation                   │
│     • Type safety: TypeScript                       │
│                                                     │
│  3. Data Access Layer                               │
│     • Prisma ORM (SQL injection prevention)         │
│     • Prepared statements                           │
│     • Transaction isolation                         │
│                                                     │
│  4. Business Logic Layer                            │
│     • Password hashing (bcryptjs)                   │
│     • Unique constraints validation                 │
│     • Relationship integrity checks                 │
│                                                     │
│  5. Database Layer                                  │
│     • PostgreSQL security                           │
│     • Row-level security (if configured)            │
│     • Encrypted connections                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────┐
│           Performance Strategies                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Client-Side Caching                             │
│     • TanStack Query with 60s stale time            │
│     • Background refetch on window focus            │
│     • Optimistic updates for mutations              │
│                                                     │
│  2. Server-Side Optimization                        │
│     • Pagination (limit records per page)           │
│     • Selective field inclusion                     │
│     • Database indexes on common queries            │
│                                                     │
│  3. Code Splitting                                  │
│     • Dynamic imports for heavy components          │
│     • Route-based code splitting                    │
│     • Lazy loading of dialog content                │
│                                                     │
│  4. Database Optimization                           │
│     • Indexed columns (email, employeeId)           │
│     • Efficient joins with include                  │
│     • Connection pooling                            │
│                                                     │
│  5. Asset Optimization                              │
│     • Image optimization (Next.js Image)            │
│     • CSS tree-shaking                              │
│     • Minification in production                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
    │
    ├── Client-Side Error
    │   ├── Form Validation Error
    │   │   └── Display field-level errors
    │   ├── Network Error
    │   │   └── Show toast notification
    │   └── Component Error
    │       └── Error boundary fallback
    │
    └── Server-Side Error
        ├── Validation Error (400)
        │   └── Return error message
        ├── Not Found (404)
        │   └── Return not found message
        ├── Conflict (400)
        │   └── Return conflict details
        └── Server Error (500)
            └── Log error + generic message
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│             Production Setup                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────┐           │
│  │         Vercel/Platform          │           │
│  ├──────────────────────────────────┤           │
│  │  • Next.js App (Edge Functions)  │           │
│  │  • Automatic deployments         │           │
│  │  • CDN for static assets         │           │
│  └───────────────┬──────────────────┘           │
│                  │                              │
│                  │ API Calls                    │
│                  │                              │
│  ┌───────────────▼──────────────────┐           │
│  │      Supabase PostgreSQL         │           │
│  ├──────────────────────────────────┤           │
│  │  • Connection pooling            │           │
│  │  • Automatic backups             │           │
│  │  • Read replicas (optional)      │           │
│  └──────────────────────────────────┘           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

**Architecture Version**: 1.0.0
**Last Updated**: January 23, 2024
