# Library Management Module - Mobile App

Complete implementation of the Library Management feature for the EduNexus mobile app with 100% feature parity to the web version.

## Overview

The Library Management module provides comprehensive functionality for managing books and book issues in the school library system. It includes role-based access control, advanced search and filtering, and fine calculation for overdue books.

## Architecture

### Technology Stack
- **Framework**: React Native with Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Navigation**: Expo Router (file-based routing)
- **Date Picking**: @react-native-community/datetimepicker

### File Structure

```
apps/mobile/
├── app/library/
│   ├── index.tsx                      # Library home screen with stats
│   ├── books/
│   │   ├── index.tsx                  # Books catalog list
│   │   ├── [id].tsx                   # Book detail screen
│   │   ├── add.tsx                    # Add book form
│   │   └── edit/
│   │       └── [id].tsx               # Edit book form
│   └── issues/
│       ├── index.tsx                  # Issued books list
│       ├── issue.tsx                  # Issue book form
│       └── return/
│           └── [id].tsx               # Return book screen
└── components/library/
    ├── BookCard.tsx                   # Book list item component
    └── IssueCard.tsx                  # Issue list item component
```

## Features

### 1. Library Dashboard (`app/library/index.tsx`)

**Features:**
- Real-time statistics display
  - Total books count
  - Total copies count
  - Available copies count
  - Currently issued books count
  - Overdue books count (if any)
- Quick action buttons to navigate to:
  - Books catalog
  - Issued books
  - Add book (LIBRARIAN only)
  - Issue book (LIBRARIAN only)

**Role Access:**
- All users can view statistics
- LIBRARIAN/ADMIN can access all quick actions
- Others can only browse books and issues

### 2. Books Catalog (`app/library/books/index.tsx`)

**Features:**
- Search books by:
  - Title
  - Author
  - ISBN
- Filter by:
  - Availability status (Available/Not Available)
  - Category (dynamically generated from books)
- Pull-to-refresh functionality
- Real-time data updates via React Query
- FAB (Floating Action Button) for adding books (LIBRARIAN only)

**Display Information:**
- Book title
- Author name
- ISBN number
- Category
- Availability badge (Available/Not Available)
- Copy count (available/total)

**Role Access:**
- All users can view books
- LIBRARIAN/ADMIN can add new books

### 3. Book Detail Screen (`app/library/books/[id].tsx`)

**Features:**
- Complete book information display
- Large book icon with availability badge
- Action buttons:
  - Issue Book (LIBRARIAN only, only if book is available)
  - Edit Book (LIBRARIAN only)
  - Delete Book (LIBRARIAN only)
- Delete confirmation dialog
- Automatic navigation back after successful operations

**Display Information:**
- Title and author
- ISBN
- Publisher
- Category
- Total copies
- Available copies
- Description

**Role Access:**
- All users can view details
- LIBRARIAN/ADMIN can edit, delete, and issue books

### 4. Add Book Form (`app/library/books/add.tsx`)

**Features:**
- Form validation using Zod schema
- Real-time error display
- Fields:
  - Title * (required)
  - Author * (required)
  - ISBN * (required)
  - Publisher (optional)
  - Category (optional)
  - Total Copies * (required, minimum 1)
  - Available Copies * (required, minimum 0)
  - Description (optional, multiline)
- Visual hint for copies validation
- Loading state during submission
- Success/Error alerts

**Validation Rules:**
- Title: Required, minimum 1 character
- Author: Required, minimum 1 character
- ISBN: Required, minimum 1 character
- Total Copies: Numeric, minimum 1
- Available Copies: Numeric, minimum 0, should be ≤ total copies

**Role Access:**
- LIBRARIAN/ADMIN only

### 5. Edit Book Form (`app/library/books/edit/[id].tsx`)

**Features:**
- Pre-populated form with existing book data
- Same validation as Add Book form
- Updates book information
- Automatic data refresh after update

**Role Access:**
- LIBRARIAN/ADMIN only

### 6. Issued Books List (`app/library/issues/index.tsx`)

**Features:**
- Search issues by:
  - Student name
  - Book title
- Filter by status:
  - All
  - Issued
  - Returned
  - Overdue
- Color-coded issue cards:
  - Yellow badge: ISSUED
  - Red badge & border: OVERDUE
  - Gray badge: RETURNED
- Pull-to-refresh functionality
- Tap to return book (LIBRARIAN only, if not already returned)

**Display Information:**
- Student name
- Book title
- Issue date
- Due date (highlighted in red if overdue)
- Return date (if returned)
- Fine amount (if applicable)
- Status badge

**Role Access:**
- All users can view issues
- LIBRARIAN/ADMIN can issue and return books

### 7. Issue Book Form (`app/library/issues/issue.tsx`)

**Features:**
- Student selection with searchable modal picker
- Book selection with searchable modal picker (only available books)
- Date pickers for:
  - Issue date (default: today, max: today)
  - Due date (default: 14 days from today, min: today)
- Real-time student and book search
- Form validation
- Loading state during submission

**Validation Rules:**
- Student: Required
- Book: Required (only books with available copies > 0)
- Issue Date: Required
- Due Date: Required

**Role Access:**
- LIBRARIAN/ADMIN only

### 8. Return Book Screen (`app/library/issues/return/[id].tsx`)

**Features:**
- Display complete issue details
- Return date picker (default: today, max: today)
- Automatic fine calculation:
  - Fine rate: ₹5 per day
  - Calculation: days overdue × fine per day
  - Visual display: Green (no fine) or Red (with fine)
- Overdue indicator if applicable
- Confirmation dialog before return
- Fine amount recorded with return

**Fine Calculation Logic:**
```typescript
const FINE_PER_DAY = 5; // ₹5 per day

const calculateFine = () => {
  const dueDate = new Date(issue.dueDate);
  const actualReturnDate = new Date(returnDate);

  if (actualReturnDate <= dueDate) return 0;

  const daysOverdue = Math.ceil(
    (actualReturnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysOverdue * FINE_PER_DAY;
};
```

**Display Information:**
- Student details (name, admission number)
- Book details (title, ISBN)
- Issue date
- Due date (highlighted if overdue)
- Return date (editable)
- Fine calculation breakdown
- Overdue warning if applicable

**Role Access:**
- LIBRARIAN/ADMIN only

## Components

### BookCard Component

**Purpose:** Display book information in list views

**Props:**
- `book`: Book object containing all book data
- `onPress`: Callback function when card is tapped

**Features:**
- Displays book icon
- Shows title (truncated to 2 lines)
- Shows author, ISBN, and category
- Availability badge (green/red)
- Copy count display
- Chevron indicator

### IssueCard Component

**Purpose:** Display issue information in list views

**Props:**
- `issue`: Issue object containing student, book, and issue data
- `onPress`: Callback function when card is tapped

**Features:**
- Student name and book title
- Status badge (color-coded)
- Issue date and due date
- Return date (if returned)
- Fine amount display (red if applicable)
- Overdue visual indicator (red border)
- Date formatting

## API Integration

All API calls use the existing `apiHelpers` from `lib/api.ts`:

```typescript
// Books
getBooks(params?)          // GET /library/books
getBook(id)               // GET /library/books/{id}
addBook(data)             // POST /library/books
updateBook(id, data)      // PUT /library/books/{id}
deleteBook(id)            // DELETE /library/books/{id}

// Issues
getBookIssues(params?)    // GET /library/issues
issueBook(data)           // POST /library/issues
returnBook(id, data?)     // POST /library/issues/{id}/return
```

## Role-Based Access Control

The module implements comprehensive role-based access control:

```typescript
const isLibrarian = ['LIBRARIAN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');
```

**Access Levels:**

| Feature | View | Add | Edit | Delete | Issue | Return |
|---------|------|-----|------|--------|-------|--------|
| ALL USERS | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| LIBRARIAN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SUPER_ADMIN | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Design Patterns

### UI/UX Patterns
- **Blue gradient header** (#3B82F6) on all screens
- **White cards** with subtle shadows for content sections
- **Color coding** for status indicators:
  - Green: Available, Returned, No Fine
  - Yellow: Issued
  - Red: Overdue, Not Available, Fine
- **Floating Action Button** (FAB) for primary actions
- **Pull-to-refresh** on all list screens
- **Modal pickers** for selection dropdowns
- **Confirmation dialogs** for destructive actions

### Form Patterns
- React Hook Form for form state management
- Zod for schema validation
- Real-time error display
- Loading states during submission
- Success/Error alerts using native Alert API
- DateTimePicker for date selection

### Data Fetching Patterns
- React Query for server state management
- Automatic cache invalidation after mutations
- Optimistic updates where applicable
- Loading and error states
- Pull-to-refresh support

## Search and Filter Implementation

### Books Search
- Client-side and server-side search support
- Searches across: title, author, ISBN
- Debounced for performance

### Books Filter
- Availability status (client-side)
- Category (server-side)
- Multiple filters can be active simultaneously

### Issues Search
- Server-side search
- Searches across: student name, book title

### Issues Filter
- Status filter: All, Issued, Returned, Overdue
- Server-side filtering

## Performance Optimizations

1. **React Query Caching**
   - Automatic caching of API responses
   - Smart cache invalidation after mutations
   - Reduced network requests

2. **Conditional Rendering**
   - Role-based UI elements only rendered when necessary
   - Dynamic loading of data

3. **Optimized Re-renders**
   - Memoized callbacks where appropriate
   - Controlled component re-renders

## Error Handling

1. **Form Validation Errors**
   - Real-time validation with Zod
   - Clear error messages below fields
   - Visual error indicators

2. **API Errors**
   - Graceful error handling with try-catch
   - User-friendly error messages via Alert
   - Fallback to generic messages if needed

3. **Network Errors**
   - Loading states during network requests
   - Error states displayed to users
   - Retry capability via pull-to-refresh

## Testing Checklist

### Books Module
- [ ] View books list with all books
- [ ] Search books by title
- [ ] Search books by author
- [ ] Search books by ISBN
- [ ] Filter books by availability
- [ ] Filter books by category
- [ ] View book details
- [ ] Add new book (LIBRARIAN)
- [ ] Edit existing book (LIBRARIAN)
- [ ] Delete book (LIBRARIAN)
- [ ] Issue book from detail screen (LIBRARIAN)

### Issues Module
- [ ] View all issues
- [ ] Search issues by student name
- [ ] Search issues by book title
- [ ] Filter issues by status
- [ ] Issue book to student (LIBRARIAN)
- [ ] Return book on time (no fine)
- [ ] Return book late (with fine)
- [ ] View returned books
- [ ] View overdue books

### Fine Calculation
- [ ] Return on due date (no fine)
- [ ] Return before due date (no fine)
- [ ] Return 1 day late (₹5 fine)
- [ ] Return multiple days late (correct fine calculation)
- [ ] Fine display in red
- [ ] Fine recorded in database

### Role-Based Access
- [ ] Non-librarian cannot add books
- [ ] Non-librarian cannot edit books
- [ ] Non-librarian cannot delete books
- [ ] Non-librarian cannot issue books
- [ ] Non-librarian cannot return books
- [ ] LIBRARIAN has full access
- [ ] ADMIN has full access

## Future Enhancements

1. **Book Reservations**
   - Allow students to reserve books that are currently unavailable
   - Notification when reserved book becomes available

2. **Book History**
   - Track complete borrowing history for each book
   - Popular books analytics

3. **Student Library Card**
   - Digital library card in mobile app
   - QR code for quick checkout

4. **Barcode Scanner**
   - Scan ISBN barcode to quickly add books
   - Scan student ID for quick issue/return

5. **Fine Payment Integration**
   - Link with fee payment system
   - Online fine payment

6. **Reading Statistics**
   - Track student reading habits
   - Recommendations based on reading history

7. **Book Reviews and Ratings**
   - Allow students to rate and review books
   - Display average ratings in book list

## Troubleshooting

### Common Issues

1. **Books not loading**
   - Check API endpoint configuration
   - Verify authentication token
   - Check network connectivity

2. **Date picker not working**
   - Ensure @react-native-community/datetimepicker is installed
   - Check platform-specific implementation

3. **Search not working**
   - Verify search parameter in API call
   - Check backend search implementation

4. **Fine calculation incorrect**
   - Verify date formats are consistent
   - Check timezone handling
   - Verify FINE_PER_DAY constant

## Conclusion

The Library Management module is fully implemented with 100% feature parity to the web version. It provides:

- Complete CRUD operations for books
- Full issue and return workflow
- Automatic fine calculation
- Role-based access control
- Search and filtering capabilities
- Mobile-optimized UI/UX
- Offline-capable with React Query caching

The module follows all established patterns in the codebase and integrates seamlessly with the existing mobile app infrastructure.
