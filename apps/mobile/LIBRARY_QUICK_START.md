# Library Management - Quick Start Guide

Quick reference guide for using the Library Management module in the EduNexus mobile app.

## Table of Contents

1. [Installation](#installation)
2. [Navigation](#navigation)
3. [Common Tasks](#common-tasks)
4. [API Reference](#api-reference)
5. [Components Reference](#components-reference)

## Installation

### Prerequisites

The Library Management module requires the following dependencies (already installed):

```json
{
  "@tanstack/react-query": "^5.x",
  "@react-native-community/datetimepicker": "^7.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "expo-router": "^3.x",
  "nativewind": "^2.x"
}
```

### File Locations

All library files are located in:
- **Screens**: `apps/mobile/app/library/`
- **Components**: `apps/mobile/components/library/`

## Navigation

### Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/library` | Library home/dashboard | All users |
| `/library/books` | Books catalog list | All users |
| `/library/books/[id]` | Book details | All users |
| `/library/books/add` | Add new book | LIBRARIAN only |
| `/library/books/edit/[id]` | Edit book | LIBRARIAN only |
| `/library/issues` | Issued books list | All users |
| `/library/issues/issue` | Issue book form | LIBRARIAN only |
| `/library/issues/return/[id]` | Return book | LIBRARIAN only |

### Navigation Examples

```typescript
// Navigate to library home
router.push('/library');

// Navigate to books catalog
router.push('/library/books');

// Navigate to specific book
router.push(`/library/books/${bookId}`);

// Navigate to add book (LIBRARIAN only)
router.push('/library/books/add');

// Navigate to edit book (LIBRARIAN only)
router.push(`/library/books/edit/${bookId}`);

// Navigate to issues
router.push('/library/issues');

// Navigate to issue book (LIBRARIAN only)
router.push('/library/issues/issue');

// Navigate to return book (LIBRARIAN only)
router.push(`/library/issues/return/${issueId}`);
```

## Common Tasks

### 1. Add a New Book (LIBRARIAN)

```typescript
// Navigate to add book screen
router.push('/library/books/add');

// Fill in the form:
{
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  isbn: "978-0743273565",
  publisher: "Scribner",
  category: "Fiction",
  totalCopies: 5,
  availableCopies: 5,
  description: "A classic American novel..."
}

// Submit the form
// Book will be added and user redirected to books list
```

### 2. Search for Books

```typescript
// On books screen, use search bar
setSearchQuery("Gatsby");

// Search works across:
// - Title
// - Author
// - ISBN
```

### 3. Filter Books

```typescript
// Filter by availability
setStatusFilter('available'); // or 'not_available'

// Filter by category
setCategoryFilter('Fiction'); // or any category name
```

### 4. Issue a Book (LIBRARIAN)

```typescript
// Navigate to issue book screen
router.push('/library/issues/issue');

// Select student from modal picker
setValue('studentId', selectedStudentId);

// Select book from modal picker (only available books shown)
setValue('bookId', selectedBookId);

// Set dates (defaults provided)
setValue('issueDate', today);
setValue('dueDate', twoWeeksFromNow);

// Submit to issue book
```

### 5. Return a Book (LIBRARIAN)

```typescript
// From issues list, tap on an issued book
// Or navigate directly:
router.push(`/library/issues/return/${issueId}`);

// Set return date (default: today)
setReturnDate(new Date().toISOString().split('T')[0]);

// Fine is calculated automatically
const fine = calculateFine(); // ₹5 per day overdue

// Confirm return
// Fine is recorded if applicable
```

### 6. Check Library Statistics

```typescript
// Navigate to library home
router.push('/library');

// View statistics:
// - Total Books
// - Total Copies
// - Available Copies
// - Currently Issued
// - Overdue Books
```

## API Reference

### API Helpers

All API calls are available through `apiHelpers`:

```typescript
import { apiHelpers } from '@/lib/api';

// Books
const books = await apiHelpers.getBooks({ search: 'query' });
const book = await apiHelpers.getBook(bookId);
await apiHelpers.addBook(bookData);
await apiHelpers.updateBook(bookId, bookData);
await apiHelpers.deleteBook(bookId);

// Issues
const issues = await apiHelpers.getBookIssues({ status: 'ISSUED' });
await apiHelpers.issueBook(issueData);
await apiHelpers.returnBook(issueId, { returnDate, fine });
```

### Query Keys

React Query cache keys used:

```typescript
// Books
['books'] // All books list
['books', searchQuery, categoryFilter, statusFilter] // Filtered books
['book', bookId] // Single book details
['books-stats'] // For statistics

// Issues
['issues'] // All issues list
['issues', searchQuery, statusFilter] // Filtered issues
['issue', issueId] // Single issue details
['issues-stats'] // For statistics
```

### Data Types

```typescript
// Book
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  category?: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
}

// Issue
interface Issue {
  id: string;
  studentId: string;
  bookId: string;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  returnDate?: string; // ISO date string
  fine?: number;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
  student: {
    firstName: string;
    lastName: string;
    admissionNo?: string;
  };
  book: {
    title: string;
    isbn?: string;
  };
}
```

## Components Reference

### BookCard

Displays a book in list views.

```typescript
import BookCard from '@/components/library/BookCard';

<BookCard
  book={book}
  onPress={() => router.push(`/library/books/${book.id}`)}
/>
```

**Props:**
- `book`: Book object
- `onPress`: Callback function

**Features:**
- Book icon
- Title (2 lines max)
- Author, ISBN, category
- Availability badge
- Copy count

### IssueCard

Displays an issue in list views.

```typescript
import IssueCard from '@/components/library/IssueCard';

<IssueCard
  issue={issue}
  onPress={() => router.push(`/library/issues/return/${issue.id}`)}
/>
```

**Props:**
- `issue`: Issue object
- `onPress`: Callback function

**Features:**
- Student name
- Book title
- Status badge (color-coded)
- Issue and due dates
- Return date (if returned)
- Fine amount (if applicable)
- Overdue indicator

### Form Components

Both used internally in forms:

```typescript
// FormInput - Text input with label and error display
<FormInput
  label="Title *"
  value={value}
  onChangeText={onChange}
  placeholder="Enter book title"
  error={errors.title?.message}
  multiline={false}
  keyboardType="default"
/>

// DatePicker usage
import DateTimePicker from '@react-native-community/datetimepicker';

{showDatePicker && (
  <DateTimePicker
    value={new Date(dateValue)}
    mode="date"
    display="default"
    onChange={handleDateChange}
    maximumDate={new Date()}
  />
)}
```

## Role-Based Access

Check user role for access control:

```typescript
import { useAuth } from '@/lib/auth';

const { user } = useAuth();
const isLibrarian = ['LIBRARIAN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.role || '');

// Show/hide features based on role
{isLibrarian && (
  <ActionButton
    icon="add"
    onPress={() => router.push('/library/books/add')}
  />
)}
```

## Fine Calculation

### Formula

```typescript
const FINE_PER_DAY = 5; // ₹5 per day

Fine = Days Overdue × Fine Per Day

Days Overdue = Math.ceil((Return Date - Due Date) / (1000 * 60 * 60 * 24))
```

### Examples

| Scenario | Fine |
|----------|------|
| Return on due date | ₹0 |
| Return 1 day before due date | ₹0 |
| Return 1 day after due date | ₹5 |
| Return 5 days after due date | ₹25 |
| Return 10 days after due date | ₹50 |

### Implementation

```typescript
const calculateFine = () => {
  if (!issue) return 0;

  const dueDate = new Date(issue.dueDate);
  const actualReturnDate = new Date(returnDate);

  // No fine if returned on or before due date
  if (actualReturnDate <= dueDate) return 0;

  // Calculate days overdue
  const daysOverdue = Math.ceil(
    (actualReturnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysOverdue * FINE_PER_DAY;
};
```

## Validation Schemas

### Book Schema

```typescript
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publisher: z.string().optional(),
  category: z.string().optional(),
  totalCopies: z.number().min(1, 'Total copies must be at least 1'),
  availableCopies: z.number().min(0, 'Available copies cannot be negative'),
  description: z.string().optional(),
});
```

### Issue Schema

```typescript
const issueSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  bookId: z.string().min(1, 'Book is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});
```

## Color Coding

### Status Colors

```typescript
// Availability
Available: 'bg-green-100 text-green-800'
Not Available: 'bg-red-100 text-red-800'

// Issue Status
ISSUED: 'bg-yellow-100 text-yellow-800'
RETURNED: 'bg-gray-100 text-gray-800'
OVERDUE: 'bg-red-100 text-red-800'

// Fine
No Fine: 'bg-green-50 border-green-200'
With Fine: 'bg-red-50 border-red-200'
```

### Header Gradient

```typescript
className="bg-blue-500" // or bg-gradient-to-r from-blue-500 to-blue-600
```

## Best Practices

### 1. Always Invalidate Cache After Mutations

```typescript
const createMutation = useMutation({
  mutationFn: (data) => apiHelpers.addBook(data),
  onSuccess: () => {
    // Invalidate all related queries
    queryClient.invalidateQueries({ queryKey: ['books'] });
    queryClient.invalidateQueries({ queryKey: ['books-stats'] });
  },
});
```

### 2. Use Pull-to-Refresh

```typescript
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  }
>
  {/* Content */}
</ScrollView>
```

### 3. Show Loading States

```typescript
if (isLoading) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-gray-600">Loading...</Text>
    </View>
  );
}
```

### 4. Handle Errors Gracefully

```typescript
const mutation = useMutation({
  mutationFn: apiCall,
  onError: (error: any) => {
    Alert.alert(
      'Error',
      error.response?.data?.error || 'An error occurred'
    );
  },
});
```

### 5. Use Confirmation Dialogs for Destructive Actions

```typescript
const handleDelete = () => {
  Alert.alert(
    'Delete Book',
    'Are you sure? This action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(),
      },
    ]
  );
};
```

## Troubleshooting

### Issue: Books not loading
**Solution:** Check network connectivity, verify API endpoint, check authentication

### Issue: Search not working
**Solution:** Verify search parameter is sent to API, check backend implementation

### Issue: Date picker not showing
**Solution:** Ensure @react-native-community/datetimepicker is installed and linked

### Issue: Fine calculation incorrect
**Solution:** Check date formats, verify timezone handling, check FINE_PER_DAY constant

### Issue: Role-based access not working
**Solution:** Verify user.role is correctly set, check role comparison logic

## Next Steps

After implementing the Library module, consider:

1. Testing all features thoroughly
2. Adding error boundaries
3. Implementing offline support
4. Adding analytics tracking
5. Creating automated tests
6. Optimizing performance with useMemo/useCallback
7. Adding accessibility features

## Support

For issues or questions:
- Check the main documentation: `LIBRARY_MODULE_DOCUMENTATION.md`
- Review the codebase patterns in existing modules (Students, Teachers, Parents)
- Verify API endpoints are working correctly
- Check React Query DevTools for cache state

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Module Status:** Complete ✓
