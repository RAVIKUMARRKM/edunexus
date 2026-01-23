# EduNexus Mobile App - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device (for testing)

### Installation
```bash
cd C:/Users/Ravi\ Kumar/Apps/edunexus/apps/mobile
npm install
```

### Running the App
```bash
# Start Expo development server
npm start

# Or run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### Scan QR Code
Open Expo Go app and scan the QR code from the terminal

---

## 📱 App Structure

### Navigation Flow
```
Login (auth/login.tsx)
  ↓
Dashboard (tabs/dashboard.tsx)
  ├── Attendance Tab (tabs/attendance.tsx)
  ├── Exams Tab (tabs/exams.tsx)
  │   └── Results Detail (results/[examId].tsx)
  ├── Fees Tab (tabs/fees.tsx)
  ├── Profile Tab (tabs/profile.tsx)
  ├── Notices (notices.tsx)
  └── Timetable (timetable.tsx)
```

---

## 🎨 Screens Overview

### 1. Attendance (`app/(tabs)/attendance.tsx`)
**For Teachers:**
- Select date, class, and section
- Mark attendance for all students (Present/Absent/Late)
- View attendance summary
- Submit batch attendance

**For Students/Parents:**
- View monthly attendance calendar
- See attendance statistics
- Check recent attendance records

**Usage:**
```typescript
// Access from Dashboard or Attendance tab
router.push('/attendance');
```

---

### 2. Exams (`app/(tabs)/exams.tsx`)
**Features:**
- View upcoming and completed exams
- See exam details (date, time, venue)
- Check exam results
- View performance statistics

**Usage:**
```typescript
// Navigate to exam details
router.push(`/results/${examId}`);
```

---

### 3. Fees (`app/(tabs)/fees.tsx`)
**Features:**
- View fee summary
- See pending and paid fees
- Process payments
- View payment history
- Contact support

**Usage:**
```typescript
// Make payment
apiHelpers.makePayment({
  feeId: 'fee-123',
  amount: 5000,
  studentId: 'student-456',
  paymentMethod: 'ONLINE'
});
```

---

### 4. Profile (`app/(tabs)/profile.tsx`)
**Features:**
- View/Edit profile information
- Manage settings
- Change password
- Logout

**Usage:**
```typescript
// Update profile
const { mutate } = useMutation({
  mutationFn: (data) => apiHelpers.updateProfile(data)
});
```

---

### 5. Notices (`app/notices.tsx`)
**Features:**
- Filter by category
- View notice details
- Track unread notices
- Share notices

**Usage:**
```typescript
// Navigate from Dashboard
router.push('/notices');
```

---

### 6. Timetable (`app/timetable.tsx`)
**Features:**
- View weekly schedule
- See period details
- Current day highlighting
- Download timetable

**Usage:**
```typescript
// Navigate from Dashboard
router.push('/timetable');
```

---

### 7. Results Detail (`app/results/[examId].tsx`)
**Features:**
- View overall performance
- See subject-wise results
- Check class statistics
- Analyze strengths & weaknesses
- Download/Print results

**Usage:**
```typescript
// Navigate from Exams screen
router.push(`/results/${examId}`);
```

---

## 🧩 Components Usage

### AttendanceCalendar
```typescript
import { AttendanceCalendar } from '@/components';

<AttendanceCalendar
  attendanceRecords={records}
  month={selectedMonth}
  onMonthChange={setSelectedMonth}
/>
```

### AttendanceList
```typescript
import { AttendanceList } from '@/components';

<AttendanceList
  students={students}
  onSubmit={handleMarkAttendance}
  loading={isLoading}
/>
```

### FeeCard
```typescript
import { FeeCard } from '@/components';

<FeeCard
  fee={feeData}
  onPress={() => handleFeePress(feeData.id)}
/>
```

### ExamCard
```typescript
import { ExamCard } from '@/components';

<ExamCard
  exam={examData}
  onPress={() => handleExamPress(examData.id)}
/>
```

### ResultCard
```typescript
import { ResultCard } from '@/components';

<ResultCard result={subjectResult} />
```

### NoticeCard
```typescript
import { NoticeCard } from '@/components';

<NoticeCard
  notice={noticeData}
  onPress={() => handleNoticePress(noticeData.id)}
/>
```

### TimetableView
```typescript
import { TimetableView } from '@/components';

<TimetableView
  schedule={weeklySchedule}
  currentDay="Monday"
/>
```

---

## 🔌 API Integration

### Setup
API configuration is in `lib/api.ts`. Update the base URL:

```typescript
// lib/api.ts
const API_URL = 'https://your-backend-api.com/api';
```

### Using API Helpers
```typescript
import { apiHelpers } from '@/lib/api';

// Fetch data
const { data } = useQuery({
  queryKey: ['exams'],
  queryFn: () => apiHelpers.getExams()
});

// Mutate data
const { mutate } = useMutation({
  mutationFn: (data) => apiHelpers.markAttendance(data)
});
```

### Available API Methods
```typescript
// Students
apiHelpers.getStudents(params)
apiHelpers.getStudent(id)

// Teachers
apiHelpers.getTeachers(params)
apiHelpers.getTeacher(id)

// Attendance
apiHelpers.getAttendance(params)
apiHelpers.markAttendance(data)

// Exams
apiHelpers.getExams(params)
apiHelpers.getExamResults(examId, studentId)

// Fees
apiHelpers.getFeeStatus(studentId)
apiHelpers.getPaymentHistory(studentId)
apiHelpers.makePayment(data)

// Notices
apiHelpers.getNotices(params)

// Profile
apiHelpers.getProfile()
apiHelpers.updateProfile(data)
```

---

## 🎭 Role-Based Access

### Check User Role
```typescript
import { useAuth } from '@/lib/auth';

const { user } = useAuth();
const isTeacher = user?.role === 'TEACHER';
const isStudent = user?.role === 'STUDENT';
```

### Conditional Rendering
```typescript
{user?.role === 'TEACHER' && (
  <TeacherOnlyComponent />
)}

{(user?.role === 'STUDENT' || user?.role === 'PARENT') && (
  <StudentParentComponent />
)}
```

---

## 🎨 Styling Guide

### Using NativeWind Classes
```typescript
<View className="bg-white rounded-xl p-4 shadow-sm">
  <Text className="text-lg font-bold text-gray-900">Title</Text>
</View>
```

### Common Patterns
```typescript
// Card
className="bg-white rounded-xl p-4 shadow-sm"

// Button Primary
className="bg-blue-500 rounded-xl py-4"

// Button Secondary
className="bg-gray-100 rounded-xl py-4"

// Status Badge
className="px-3 py-1 rounded-full bg-green-100"

// Gradient Header
className="bg-gradient-to-r from-blue-500 to-purple-500"
```

### Color Palette
```typescript
Primary:   #3B82F6 (blue-500)
Secondary: #8B5CF6 (purple-500)
Success:   #10B981 (green-500)
Warning:   #F59E0B (yellow-500)
Error:     #EF4444 (red-500)
Gray:      #6B7280, #9CA3AF, #D1D5DB
```

---

## 🔐 Authentication

### Login
```typescript
import { useAuth } from '@/lib/auth';

const { login } = useAuth();

await login(email, password);
```

### Logout
```typescript
const { logout } = useAuth();

await logout();
router.replace('/login');
```

### Access User Data
```typescript
const { user, isAuthenticated } = useAuth();

console.log(user.name);
console.log(user.role);
console.log(user.email);
```

---

## 🧪 Testing

### Test API Endpoints
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest

# Run tests
npm test
```

### Example Test
```typescript
import { render } from '@testing-library/react-native';
import { ExamCard } from '@/components';

test('renders exam card correctly', () => {
  const exam = {
    id: '1',
    name: 'Mid Term',
    date: '2024-01-20',
    status: 'UPCOMING'
  };

  const { getByText } = render(<ExamCard exam={exam} onPress={() => {}} />);
  expect(getByText('Mid Term')).toBeTruthy();
});
```

---

## 🐛 Debugging

### Enable Debug Mode
```bash
# Start with debug mode
npx expo start --dev-client
```

### View Logs
```bash
# View logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

### Common Issues

**1. API not connecting:**
- Check API_URL in `lib/api.ts`
- Verify backend is running
- Check network permissions

**2. Components not rendering:**
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**3. Styling issues:**
- Verify NativeWind setup
- Check tailwind.config.js
- Restart Metro bundler

---

## 📦 Building for Production

### Android
```bash
# Build APK
eas build --platform android --profile production

# Build AAB for Play Store
eas build --platform android --profile production:bundle
```

### iOS
```bash
# Build IPA
eas build --platform ios --profile production
```

### Configure Build
```json
// app.json or app.config.js
{
  "expo": {
    "name": "EduNexus",
    "slug": "edunexus",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.edunexus"
    },
    "android": {
      "package": "com.yourcompany.edunexus"
    }
  }
}
```

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnavigation.org/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## 🆘 Support

### Common Commands
```bash
npm start          # Start development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm test          # Run tests
npm run lint      # Lint code
npx expo start -c # Clear cache and start
```

### Need Help?
1. Check `SCREENS_DOCUMENTATION.md` for detailed info
2. Review component source code
3. Test API endpoints separately
4. Check Expo logs for errors

---

**Happy Coding! 🚀**
