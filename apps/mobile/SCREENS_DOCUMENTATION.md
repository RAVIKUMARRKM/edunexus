# EduNexus Mobile App Screens Documentation

## Overview
This document provides details about all the mobile app screens and components built for the EduNexus School Management System.

## Tech Stack
- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: @expo/vector-icons
- **State Management**: Zustand
- **API Client**: Axios with React Query
- **Navigation**: Expo Router (File-based routing)

## Tab Screens (app/(tabs)/)

### 1. Dashboard (dashboard.tsx)
**Already Existed** - Main overview screen showing:
- Welcome header with user info
- Statistics cards (students, teachers, attendance, fees)
- Quick action buttons for different modules
- Recent activities feed
- Role-based content filtering

### 2. Attendance (attendance.tsx)
**Location**: `app/(tabs)/attendance.tsx`

**Features**:
- **Teacher View**:
  - Date selector for marking attendance
  - Class and section selector
  - Student list with attendance marking (Present/Absent/Late)
  - Attendance summary with counts
  - Submit attendance functionality

- **Student/Parent View**:
  - Attendance statistics (Present, Absent counts)
  - Overall attendance percentage with visual progress
  - Monthly calendar view showing attendance status
  - Color-coded calendar (Green=Present, Red=Absent, Yellow=Late, Blue=Holiday)
  - Recent attendance list

**Components Used**:
- AttendanceCalendar
- AttendanceList

### 3. Exams (exams.tsx)
**Location**: `app/(tabs)/exams.tsx`

**Features**:
- Exam overview with statistics (Upcoming, Completed, Average)
- Tab selector (Upcoming/Completed)
- Exam cards showing:
  - Exam name, subject, date, time, venue
  - Status badges (Upcoming/Ongoing/Completed/Published)
  - Results for completed exams
  - Percentage and grade display
- Performance summary for completed exams
- Exam preparation tips for upcoming exams
- Navigation to detailed results

**Components Used**:
- ExamCard

### 4. Fees (fees.tsx)
**Location**: `app/(tabs)/fees.tsx`

**Features**:
- Fee summary header (Total Due, Paid, Overdue)
- Tab selector (Pending/Paid)
- Fee cards showing:
  - Fee title, category, amount
  - Status badges (Pending/Paid/Overdue)
  - Due dates
  - Payment breakdown
- Overdue payment alerts
- Payment methods information
- Payment history for paid fees
- Pay now functionality with confirmation dialog
- Help section with contact options

**Components Used**:
- FeeCard

### 5. Profile (profile.tsx)
**Location**: `app/(tabs)/profile.tsx`

**Features**:
- Profile header with avatar
- User statistics (Attendance, Exams, Grade)
- Personal information section:
  - View mode: Display all user details
  - Edit mode: Editable fields with save functionality
- Student-specific fields (Class, Section, Roll Number, Admission Date)
- Settings section:
  - Notifications
  - Change Password
  - Language selection
  - Dark mode toggle
- Account section:
  - Help & Support
  - About
  - Terms & Conditions
  - Privacy Policy
- Logout functionality with confirmation
- App version display

## Additional Screens (app/)

### 6. Notices (notices.tsx)
**Location**: `app/notices.tsx`

**Features**:
- Category filter tabs (All, Urgent, Academic, Events, Holidays, General)
- Unread notices counter
- Notice cards showing:
  - Category badges with color coding
  - Title and content preview
  - Author information
  - Timestamp
  - Read/unread indicator
- Notice detail modal:
  - Full notice content
  - Author details
  - Attachments (if any)
  - Share and Save options
- Urgent notice alerts

**Components Used**:
- NoticeCard

### 7. Timetable (timetable.tsx)
**Location**: `app/timetable.tsx`

**Features**:
- Class and section display
- Download timetable option
- Weekly schedule view
- Day-wise period listing:
  - Subject name
  - Teacher name
  - Room number
  - Time slots
- Current day highlighting
- Color-coded periods
- Quick guide legend
- Empty state for unavailable timetables

**Components Used**:
- TimetableView

### 8. Exam Results Detail (results/[examId].tsx)
**Location**: `app/results/[examId].tsx`

**Features**:
- Exam header with name and date
- Overall performance card:
  - Large percentage display
  - Performance message
  - Total marks, obtained marks, grade
- Subject-wise results list
- Class performance statistics:
  - Class average
  - Highest and lowest scores
  - Student rank
- Teacher's remarks
- Performance analysis:
  - Strengths (subjects above 75%)
  - Areas for improvement (subjects below 60%)
- Action buttons:
  - Download PDF
  - Print
- Contact teacher option
- Share functionality

**Components Used**:
- ResultCard

## Reusable Components (components/)

### 1. AttendanceCalendar.tsx
**Purpose**: Display monthly calendar with attendance status

**Props**:
- `attendanceRecords`: Array of attendance records
- `month`: Currently displayed month (Date)
- `onMonthChange`: Callback for month navigation

**Features**:
- Month navigation (previous/next)
- Color-coded attendance status
- Legend for status colors
- Responsive calendar grid

### 2. AttendanceList.tsx
**Purpose**: List students for marking attendance

**Props**:
- `students`: Array of student objects
- `onSubmit`: Callback for submitting attendance
- `loading`: Loading state boolean

**Features**:
- Student cards with avatars
- Three status buttons (Present/Absent/Late)
- Attendance summary with counts
- Progress tracking
- Submit button (enabled when all students marked)

### 3. FeeCard.tsx
**Purpose**: Display fee information card

**Props**:
- `fee`: Fee object with details
- `onPress`: Callback for card press

**Features**:
- Status badges with color coding
- Amount breakdown (Total, Paid, Remaining)
- Due date display
- Overdue alerts
- Currency formatting (INR)

### 4. ExamCard.tsx
**Purpose**: Display exam information card

**Props**:
- `exam`: Exam object with details
- `onPress`: Callback for card press

**Features**:
- Status badges (Upcoming/Ongoing/Completed/Published)
- Date and time display
- Venue information
- Results display (for published exams)
- Percentage and grade visualization
- Total marks display

### 5. ResultCard.tsx
**Purpose**: Display subject-wise result

**Props**:
- `result`: Subject result object

**Features**:
- Grade badges with color coding
- Performance icons based on grade
- Marks obtained vs total marks
- Percentage display
- Progress bar visualization

### 6. NoticeCard.tsx
**Purpose**: Display notice card

**Props**:
- `notice`: Notice object with details
- `onPress`: Callback for card press

**Features**:
- Category badges with icons and colors
- Unread indicator
- Content preview (2 lines)
- Author information
- Relative timestamp
- Urgent notice alerts

### 7. TimetableView.tsx
**Purpose**: Display weekly timetable

**Props**:
- `schedule`: Array of day schedules
- `currentDay`: Current day name (optional)

**Features**:
- Weekly overview header
- Quick guide legend
- Day-wise sections
- Current day highlighting
- Color-coded periods
- Period details (Subject, Teacher, Room, Time)
- Empty state handling

## API Integration

All screens use the API helper functions from `lib/api.ts`:

### Attendance
- `getAttendance(params)` - Fetch attendance records
- `markAttendance(data)` - Mark attendance for students

### Exams
- `getExams(params)` - Fetch exams list
- `getExamResults(examId, studentId)` - Fetch exam results

### Fees
- `getFeeStatus(studentId)` - Fetch fee status
- `getPaymentHistory(studentId)` - Fetch payment history
- `makePayment(data)` - Process payment

### Notices
- `getNotices(params)` - Fetch notices list

### Profile
- `getProfile()` - Fetch user profile
- `updateProfile(data)` - Update profile information

## Role-Based Access

The app supports different roles with appropriate content:

1. **ADMIN**: Full access to all features
2. **TEACHER**: Mark attendance, view students, access exams
3. **STUDENT**: View own attendance, exams, fees, results
4. **PARENT**: View child's attendance, exams, fees, results
5. **ACCOUNTANT**: Access fees and payment features
6. **LIBRARIAN**: Access library features (from dashboard)
7. **TRANSPORT_MANAGER**: Access transport features (from dashboard)

## Styling Guidelines

### Color Scheme
- Primary Blue: `#3B82F6`
- Purple Accent: `#8B5CF6`
- Success Green: `#10B981`
- Warning Yellow: `#F59E0B`
- Error Red: `#EF4444`
- Gray Shades: `#6B7280`, `#9CA3AF`, `#D1D5DB`

### Common Patterns
- **Cards**: `bg-white rounded-xl p-4 shadow-sm`
- **Headers**: Gradient backgrounds with white text
- **Buttons**: Rounded with appropriate colors
- **Status Badges**: Rounded-full with light backgrounds
- **Icons**: Ionicons from @expo/vector-icons

## Navigation Flow

```
Dashboard (Tab)
├── Attendance (Tab)
├── Exams (Tab)
│   └── Results Detail (/results/[examId])
├── Fees (Tab)
├── Profile (Tab)
├── Notices (Screen)
└── Timetable (Screen)
```

## State Management

- **Auth State**: Managed by Zustand store (`lib/auth.ts`)
- **API State**: Managed by React Query with caching
- **Local State**: Component-level useState for UI interactions

## Error Handling

All screens implement:
- Loading states with ActivityIndicator
- Error handling with Alert dialogs
- Empty states with helpful messages
- Refresh functionality with RefreshControl

## Future Enhancements

Potential improvements:
1. Offline support with local storage
2. Push notifications for urgent notices
3. Real-time updates with WebSocket
4. Advanced filtering and search
5. Data export functionality
6. Multi-language support
7. Dark mode implementation
8. Accessibility improvements

## Testing Recommendations

1. Test all role-based access controls
2. Verify API error handling
3. Test offline scenarios
4. Validate form inputs
5. Test navigation flows
6. Check responsive layouts
7. Verify data refresh functionality

## Deployment Notes

Before deployment:
1. Update API URL in `lib/api.ts`
2. Configure app.json with proper credentials
3. Test on both iOS and Android
4. Verify all permissions (camera, storage, etc.)
5. Test payment gateway integration
6. Ensure proper error logging

---

**Built with ❤️ for EduNexus School Management System**
