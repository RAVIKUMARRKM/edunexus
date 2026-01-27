# ✅ EduNexus Android APK Testing Checklist

Use this comprehensive checklist to verify the app functionality on your physical device.

---

## 📱 **Phase 1: App Launch & Authentication**

### Splash Screen
- [ ] App displays splash screen with EduNexus branding
- [ ] Splash screen shows for ~1-2 seconds
- [ ] Automatically navigates to login or dashboard based on auth state

### Login Screen
- [ ] Login screen displays with email and password fields
- [ ] Email field accepts input
- [ ] Password field accepts input with hidden characters
- [ ] Password field has visibility toggle icon
- [ ] "Login" button is visible and clickable
- [ ] Entering valid credentials navigates to dashboard
- [ ] Entering invalid credentials shows error message
- [ ] Loading indicator shows while logging in
- [ ] Keyboard dismisses after login

**Test Credentials:**
- Email: `admin@edunexus.com`
- Password: `admin123`

---

## 🏠 **Phase 2: Dashboard**

### Dashboard Layout
- [ ] Welcome header displays with gradient background (Indigo)
- [ ] User name displays correctly
- [ ] User role badge displays (e.g., "ADMIN")
- [ ] 4 stat cards display in 2x2 grid:
  - [ ] Total Students (Blue, shows "1250")
  - [ ] Total Teachers (Green, shows "85")
  - [ ] Today's Attendance (Amber, shows "92%")
  - [ ] Fee Collection (Red, shows "₹375K")

### Quick Actions
- [ ] Quick actions grid displays (8 items in 4 columns)
- [ ] All icons display correctly
- [ ] Clicking "Students" navigates to students list
- [ ] Clicking "Teachers" navigates to teachers list
- [ ] Clicking "Classes" shows "Coming Soon" placeholder
- [ ] Clicking "Exams" shows "Coming Soon" placeholder
- [ ] Clicking "Fees" shows "Coming Soon" placeholder
- [ ] Clicking "Library" shows "Coming Soon" placeholder
- [ ] Clicking "Transport" shows "Coming Soon" placeholder
- [ ] Clicking "Notices" shows "Coming Soon" placeholder

### Recent Activities
- [ ] Recent activities section displays
- [ ] Shows 5 recent activities
- [ ] Each activity has icon, message, and timestamp
- [ ] Activities scroll if needed

### Pull-to-Refresh
- [ ] Swipe down to refresh dashboard
- [ ] Loading indicator shows during refresh
- [ ] Data updates after refresh

---

## 🧑‍🎓 **Phase 3: Students Module**

### Students List Screen
- [ ] Students list displays on navigation from dashboard
- [ ] Back button navigates to dashboard
- [ ] Search bar displays at top
- [ ] Filter chips display (ALL, ACTIVE, INACTIVE, LEFT, GRADUATED, SUSPENDED)
- [ ] FloatingActionButton (FAB) displays at bottom right for adding students

### Search & Filter
- [ ] Typing in search bar filters students by name
- [ ] Typing in search bar filters students by admission number
- [ ] Search clears when "X" button is clicked
- [ ] Clicking filter chips filters the list
- [ ] "ALL" chip shows all students
- [ ] Status chips show relevant students
- [ ] Filter can be combined with search

### Student Cards
- [ ] Student cards display in list
- [ ] Each card shows avatar (initials if no photo)
- [ ] Student name displays (bold)
- [ ] Admission number displays with icon
- [ ] Class & Section display with icon
- [ ] Status badge displays with appropriate color:
  - [ ] ACTIVE: Primary color
  - [ ] INACTIVE: Gray
  - [ ] LEFT: Error/Red
- [ ] Clicking a card navigates to student detail

### Add Student
- [ ] Clicking FAB navigates to Add Student screen
- [ ] Form displays with all sections:
  - [ ] Personal Information (first name*, last name*, DOB*, gender*, etc.)
  - [ ] Academic Information (admission no*, class*, section*, etc.)
  - [ ] Contact Information (email, phone, address, etc.)
  - [ ] Medical Information (conditions, allergies)
  - [ ] Parent Information
- [ ] Required fields are marked with asterisk
- [ ] Gender dropdown works (MALE, FEMALE, OTHER)
- [ ] Blood group dropdown works
- [ ] Status dropdown works
- [ ] Save button is enabled when required fields are filled
- [ ] Clicking Save creates student and navigates back
- [ ] Success message shows after save
- [ ] Cancel button navigates back without saving

### Student Detail Screen
- [ ] Student detail screen displays all information in organized sections
- [ ] Header shows large avatar and student name
- [ ] Status badge displays at top
- [ ] Personal Information section displays all fields
- [ ] Contact Information section displays
- [ ] Academic Information section displays
- [ ] Medical Information section displays
- [ ] Parent Information section displays
- [ ] Edit button displays in top bar
- [ ] Delete button displays in top bar
- [ ] Back button navigates to students list

### Edit Student
- [ ] Clicking Edit navigates to edit screen
- [ ] Form pre-fills with existing student data
- [ ] All fields are editable
- [ ] Save updates the student
- [ ] Changes reflect in detail screen after save
- [ ] Cancel discards changes

### Delete Student
- [ ] Clicking Delete shows confirmation dialog
- [ ] Dialog asks "Are you sure?"
- [ ] "Cancel" dismisses dialog without deleting
- [ ] "Delete" removes student and navigates back to list
- [ ] Deleted student no longer appears in list

### Pull-to-Refresh (Students List)
- [ ] Swipe down refreshes student list
- [ ] Loading indicator shows
- [ ] List updates after refresh

---

## 👨‍🏫 **Phase 4: Teachers Module**

### Teachers List Screen
- [ ] Teachers list displays
- [ ] Back button works
- [ ] Search bar filters by name and employee ID
- [ ] Filter chips display (ALL, ACTIVE, ON_LEAVE, RESIGNED, TERMINATED)
- [ ] FAB displays for adding teachers

### Teacher Cards
- [ ] Teacher cards display in list
- [ ] Avatar displays with Material icon
- [ ] Teacher name displays (bold)
- [ ] Employee ID displays with icon
- [ ] Department displays
- [ ] Designation displays
- [ ] Status badge displays with color
- [ ] Clicking card navigates to teacher detail

### Add Teacher
- [ ] Form displays with all sections
- [ ] Personal Information section works
- [ ] Contact Information section works
- [ ] Professional Information section works
- [ ] Department dropdown loads and works
- [ ] Status dropdown works
- [ ] Experience and Salary fields accept numbers
- [ ] Date pickers work for DOB and Joining Date
- [ ] Save creates teacher
- [ ] Cancel navigates back

### Teacher Detail Screen
- [ ] All teacher information displays in sections
- [ ] Personal Information section displays
- [ ] Contact Information section displays
- [ ] Professional Information section displays
- [ ] Department & Designation section displays
- [ ] Salary Details section displays (for ADMIN/ACCOUNTANT only)
- [ ] Status section displays
- [ ] Edit and Delete buttons work

### Edit & Delete Teacher
- [ ] Edit pre-fills form and saves changes
- [ ] Delete shows confirmation and removes teacher

---

## 👤 **Phase 5: Profile & Settings**

### Profile Screen
- [ ] Profile screen displays from bottom navigation
- [ ] Large circular avatar displays (with initials)
- [ ] User name displays in bold
- [ ] Role badge displays below name
- [ ] Email displays with icon
- [ ] Phone displays with icon (if available)
- [ ] Menu items display:
  - [ ] Edit Profile
  - [ ] Change Password
  - [ ] Notifications Settings (placeholder)
  - [ ] About App
  - [ ] Logout

### Edit Profile
- [ ] Clicking "Edit Profile" navigates to edit screen
- [ ] Current avatar displays
- [ ] "Change Photo" button present (placeholder)
- [ ] Name field pre-filled and editable
- [ ] Phone field editable
- [ ] Email field read-only (shows explanation)
- [ ] Save button updates profile
- [ ] Cancel navigates back
- [ ] Changes reflect in profile screen

### Change Password
- [ ] Clicking "Change Password" navigates to password screen
- [ ] Security notice displays at top
- [ ] Three password fields display:
  - [ ] Current Password (with visibility toggle)
  - [ ] New Password (with visibility toggle)
  - [ ] Confirm New Password (with visibility toggle)
- [ ] Password requirements display:
  - [ ] Minimum 8 characters (✓ when met)
  - [ ] At least one uppercase (✓ when met)
  - [ ] At least one number (✓ when met)
- [ ] Requirements update in real-time as you type
- [ ] Save button disabled when requirements not met
- [ ] Save button enabled when all requirements met
- [ ] Clicking Save shows loading indicator
- [ ] Success message shows after password change
- [ ] Automatically navigates to login screen
- [ ] Must log in again with new password

### About App
- [ ] Clicking "About App" shows app version (1.0.0)

### Logout
- [ ] Clicking "Logout" shows confirmation dialog
- [ ] "Cancel" dismisses dialog
- [ ] "Logout" clears auth and navigates to login
- [ ] Cannot navigate back to dashboard after logout
- [ ] Must log in again to access app

---

## 🧭 **Phase 6: Bottom Navigation**

### Navigation Bar
- [ ] Bottom navigation bar displays on main screens
- [ ] 5 tabs display: Dashboard, Attendance, Exams, Fees, Profile
- [ ] Each tab has icon and label
- [ ] Currently selected tab is highlighted
- [ ] Clicking Dashboard navigates to dashboard
- [ ] Clicking Attendance shows "Coming Soon"
- [ ] Clicking Exams shows "Coming Soon"
- [ ] Clicking Fees shows "Coming Soon"
- [ ] Clicking Profile navigates to profile

### FAB (Floating Action Button)
- [ ] FAB displays on applicable screens
- [ ] FAB shows AI Assistant icon (or add icon)
- [ ] FAB is clickable
- [ ] FAB animates on scroll (optional)

---

## 🎨 **Phase 7: UI/UX Quality**

### Theme & Colors
- [ ] App uses Indigo-600 primary color consistently
- [ ] Material 3 design is evident
- [ ] Cards have rounded corners and proper elevation
- [ ] Status badges have appropriate colors
- [ ] Icons are clear and match Material Design guidelines

### Typography
- [ ] Text is readable and properly sized
- [ ] Headers are bold and prominent
- [ ] Body text is comfortable to read
- [ ] Labels are clear

### Loading States
- [ ] Loading indicators show during data fetch
- [ ] Screens don't freeze during loading
- [ ] Loading indicators are centered and visible

### Error States
- [ ] Error messages display when operations fail
- [ ] Error messages are user-friendly
- [ ] Retry options available where applicable

### Empty States
- [ ] Empty list shows helpful message
- [ ] Empty search results show "No results found"
- [ ] Empty states have appropriate icons/illustrations

### Animations
- [ ] Screen transitions are smooth
- [ ] No jarring or laggy animations
- [ ] Pull-to-refresh animation is smooth

---

## 🔄 **Phase 8: Data Persistence**

### Auth Persistence
- [ ] After logging in, close app completely
- [ ] Reopen app
- [ ] App navigates directly to dashboard (without login)
- [ ] User data persists (name, role, etc.)

### Logout Persistence
- [ ] After logout, close app
- [ ] Reopen app
- [ ] App navigates to login screen (not dashboard)

---

## 📱 **Phase 9: Device Compatibility**

### Screen Sizes
- [ ] UI looks good on your phone's screen size
- [ ] Text is not cut off
- [ ] Buttons are reachable
- [ ] No content overlaps

### Orientation
- [ ] App works in portrait mode
- [ ] (Optional) Test landscape mode
- [ ] UI adapts to orientation change

### Performance
- [ ] App launches within 2-3 seconds
- [ ] Screen navigation is instant
- [ ] List scrolling is smooth
- [ ] No noticeable lag or freezing
- [ ] App doesn't crash during normal usage

### Network
- [ ] App handles network errors gracefully
- [ ] Error messages shown for network failures
- [ ] Can retry failed operations

---

## 🐛 **Phase 10: Bug Checks**

### Critical Bugs (Must Fix)
- [ ] No crashes on launch
- [ ] No crashes on login
- [ ] No crashes on navigation
- [ ] No crashes on form submission
- [ ] No data loss during operations

### UI Bugs
- [ ] No overlapping text or UI elements
- [ ] All buttons are clickable
- [ ] All text is readable
- [ ] No cut-off content
- [ ] No broken images

### Logic Bugs
- [ ] Search filters correctly
- [ ] Status filters work as expected
- [ ] Form validation works properly
- [ ] Delete confirmation prevents accidental deletion

---

## 📊 **Test Summary**

### Overall Assessment
- **Total Checks:** ~150
- **Passed:** ___
- **Failed:** ___
- **Not Applicable:** ___

### Critical Issues Found
1. ___
2. ___
3. ___

### Minor Issues Found
1. ___
2. ___
3. ___

### Recommendations
- ___
- ___
- ___

---

## ✅ **Approval Status**

After testing, mark your approval:

- [ ] **APPROVED** - Ready for Phase 3 implementation (remaining modules)
- [ ] **NEEDS FIXES** - Critical issues must be resolved first
- [ ] **REWORK REQUIRED** - Major changes needed

---

## 📝 **Notes**

Add any additional observations or feedback here:

```
___
___
___
```

---

**Testing Date:** __________
**Tester Name:** __________
**Device Model:** __________
**Android Version:** __________
**App Version:** 1.0.0

---

**After completing this checklist, report back with:**
1. Overall pass/fail status
2. List of critical bugs (if any)
3. Approval to proceed with remaining module implementation
