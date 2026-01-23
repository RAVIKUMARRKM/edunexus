// Constants for EduNexus

export const APP_NAME = 'EduNexus';
export const APP_DESCRIPTION = 'Complete School Lifecycle Management System';

// Role Labels
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrator',
  PRINCIPAL: 'Principal',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
  STAFF: 'Staff',
  ACCOUNTANT: 'Accountant',
  LIBRARIAN: 'Librarian',
  TRANSPORT_MANAGER: 'Transport Manager',
  HOSTEL_WARDEN: 'Hostel Warden',
};

// Gender Options
export const GENDER_OPTIONS = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
];

// Blood Group Options
export const BLOOD_GROUP_OPTIONS = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
];

// Attendance Status Options
export const ATTENDANCE_STATUS_OPTIONS = [
  { label: 'Present', value: 'PRESENT', color: 'green' },
  { label: 'Absent', value: 'ABSENT', color: 'red' },
  { label: 'Late', value: 'LATE', color: 'yellow' },
  { label: 'Half Day', value: 'HALF_DAY', color: 'orange' },
  { label: 'Leave', value: 'LEAVE', color: 'blue' },
];

// Fee Type Options
export const FEE_TYPE_OPTIONS = [
  { label: 'Tuition Fee', value: 'TUITION' },
  { label: 'Admission Fee', value: 'ADMISSION' },
  { label: 'Transport Fee', value: 'TRANSPORT' },
  { label: 'Hostel Fee', value: 'HOSTEL' },
  { label: 'Library Fee', value: 'LIBRARY' },
  { label: 'Laboratory Fee', value: 'LABORATORY' },
  { label: 'Sports Fee', value: 'SPORTS' },
  { label: 'Exam Fee', value: 'EXAM' },
  { label: 'Other', value: 'OTHER' },
];

// Fee Frequency Options
export const FEE_FREQUENCY_OPTIONS = [
  { label: 'One Time', value: 'ONE_TIME' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Half Yearly', value: 'HALF_YEARLY' },
  { label: 'Yearly', value: 'YEARLY' },
];

// Payment Mode Options
export const PAYMENT_MODE_OPTIONS = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Card', value: 'CARD' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Net Banking', value: 'NET_BANKING' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Demand Draft', value: 'DD' },
];

// Exam Type Options
export const EXAM_TYPE_OPTIONS = [
  { label: 'Unit Test', value: 'UNIT_TEST' },
  { label: 'Mid Term', value: 'MID_TERM' },
  { label: 'Final Exam', value: 'FINAL' },
  { label: 'Practical', value: 'PRACTICAL' },
  { label: 'Assignment', value: 'ASSIGNMENT' },
];

// Subject Type Options
export const SUBJECT_TYPE_OPTIONS = [
  { label: 'Theory', value: 'THEORY' },
  { label: 'Practical', value: 'PRACTICAL' },
  { label: 'Both', value: 'BOTH' },
];

// Leave Type Options
export const LEAVE_TYPE_OPTIONS = [
  { label: 'Casual Leave', value: 'CASUAL' },
  { label: 'Sick Leave', value: 'SICK' },
  { label: 'Earned Leave', value: 'EARNED' },
  { label: 'Maternity Leave', value: 'MATERNITY' },
  { label: 'Paternity Leave', value: 'PATERNITY' },
  { label: 'Unpaid Leave', value: 'UNPAID' },
];

// Vehicle Type Options
export const VEHICLE_TYPE_OPTIONS = [
  { label: 'Bus', value: 'BUS' },
  { label: 'Van', value: 'VAN' },
  { label: 'Auto', value: 'AUTO' },
  { label: 'Car', value: 'CAR' },
];

// Room Type Options
export const ROOM_TYPE_OPTIONS = [
  { label: 'Single', value: 'SINGLE' },
  { label: 'Double', value: 'DOUBLE' },
  { label: 'Triple', value: 'TRIPLE' },
  { label: 'Dormitory', value: 'DORMITORY' },
];

// Hostel Type Options
export const HOSTEL_TYPE_OPTIONS = [
  { label: 'Boys Hostel', value: 'BOYS' },
  { label: 'Girls Hostel', value: 'GIRLS' },
  { label: 'Staff Quarters', value: 'STAFF' },
];

// Notice Type Options
export const NOTICE_TYPE_OPTIONS = [
  { label: 'General', value: 'GENERAL' },
  { label: 'Academic', value: 'ACADEMIC' },
  { label: 'Exam', value: 'EXAM' },
  { label: 'Event', value: 'EVENT' },
  { label: 'Holiday', value: 'HOLIDAY' },
  { label: 'Emergency', value: 'EMERGENCY' },
  { label: 'Fee Reminder', value: 'FEE_REMINDER' },
];

// Days of Week
export const DAYS_OF_WEEK = [
  { label: 'Sunday', value: 0, short: 'Sun' },
  { label: 'Monday', value: 1, short: 'Mon' },
  { label: 'Tuesday', value: 2, short: 'Tue' },
  { label: 'Wednesday', value: 3, short: 'Wed' },
  { label: 'Thursday', value: 4, short: 'Thu' },
  { label: 'Friday', value: 5, short: 'Fri' },
  { label: 'Saturday', value: 6, short: 'Sat' },
];

// Time Slots (for timetable)
export const TIME_SLOTS = [
  { start: '08:00', end: '08:45', label: 'Period 1' },
  { start: '08:45', end: '09:30', label: 'Period 2' },
  { start: '09:30', end: '10:15', label: 'Period 3' },
  { start: '10:15', end: '10:30', label: 'Break' },
  { start: '10:30', end: '11:15', label: 'Period 4' },
  { start: '11:15', end: '12:00', label: 'Period 5' },
  { start: '12:00', end: '12:45', label: 'Period 6' },
  { start: '12:45', end: '13:30', label: 'Lunch' },
  { start: '13:30', end: '14:15', label: 'Period 7' },
  { start: '14:15', end: '15:00', label: 'Period 8' },
];

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Book Categories
export const BOOK_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'History',
  'Geography', 'Literature', 'Biography', 'Technology', 'Reference',
  'Textbook', 'Comics', 'Magazine', 'Journal', 'Other',
];

// Inventory Categories
export const INVENTORY_CATEGORIES = [
  'Stationery', 'Furniture', 'Electronics', 'Sports Equipment',
  'Lab Equipment', 'Cleaning Supplies', 'Office Supplies', 'Other',
];

// Navigation Items (by role)
export const NAVIGATION_ITEMS = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Students', href: '/students', icon: 'Users' },
    { name: 'Teachers', href: '/teachers', icon: 'GraduationCap' },
    { name: 'Classes', href: '/classes', icon: 'School' },
    { name: 'Exams', href: '/exams', icon: 'FileText' },
    { name: 'Fees', href: '/fees', icon: 'CreditCard' },
    { name: 'Library', href: '/library', icon: 'BookOpen' },
    { name: 'Transport', href: '/transport', icon: 'Bus' },
    { name: 'Hostel', href: '/hostel', icon: 'Building' },
    { name: 'HR & Payroll', href: '/hr', icon: 'Briefcase' },
    { name: 'Inventory', href: '/inventory', icon: 'Package' },
    { name: 'Communication', href: '/communication', icon: 'MessageSquare' },
    { name: 'Reports', href: '/reports', icon: 'BarChart' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ],
  teacher: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Classes', href: '/my-classes', icon: 'School' },
    { name: 'Attendance', href: '/attendance', icon: 'ClipboardCheck' },
    { name: 'Exams', href: '/exams', icon: 'FileText' },
    { name: 'Timetable', href: '/timetable', icon: 'Calendar' },
    { name: 'Leave', href: '/leave', icon: 'CalendarOff' },
    { name: 'Communication', href: '/communication', icon: 'MessageSquare' },
  ],
  student: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Attendance', href: '/attendance', icon: 'ClipboardCheck' },
    { name: 'Exams', href: '/exams', icon: 'FileText' },
    { name: 'Results', href: '/results', icon: 'Award' },
    { name: 'Fees', href: '/fees', icon: 'CreditCard' },
    { name: 'Library', href: '/library', icon: 'BookOpen' },
    { name: 'Timetable', href: '/timetable', icon: 'Calendar' },
    { name: 'Notices', href: '/notices', icon: 'Bell' },
  ],
  parent: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Children', href: '/children', icon: 'Users' },
    { name: 'Attendance', href: '/attendance', icon: 'ClipboardCheck' },
    { name: 'Results', href: '/results', icon: 'Award' },
    { name: 'Fees', href: '/fees', icon: 'CreditCard' },
    { name: 'Transport', href: '/transport', icon: 'Bus' },
    { name: 'Notices', href: '/notices', icon: 'Bell' },
    { name: 'Messages', href: '/messages', icon: 'MessageSquare' },
  ],
};

// Status Colors
export const STATUS_COLORS = {
  active: 'green',
  inactive: 'gray',
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  completed: 'blue',
  cancelled: 'gray',
};

// Pagination Defaults
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  limitOptions: [10, 25, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  display: 'DD MMM YYYY',
  input: 'YYYY-MM-DD',
  datetime: 'DD MMM YYYY, hh:mm A',
  time: 'hh:mm A',
};

// File Upload Limits
export const FILE_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  students: '/api/students',
  teachers: '/api/teachers',
  classes: '/api/classes',
  sections: '/api/sections',
  subjects: '/api/subjects',
  exams: '/api/exams',
  fees: '/api/fees',
  library: '/api/library',
  transport: '/api/transport',
  hostel: '/api/hostel',
  hr: '/api/hr',
  inventory: '/api/inventory',
  notices: '/api/notices',
  messages: '/api/messages',
  reports: '/api/reports',
  settings: '/api/settings',
  dashboard: '/api/dashboard',
};
