# Library Management Module - EduNexus

Complete library management system for tracking books, issues, returns, and fines.

## Features

### 1. Book Catalog Management
- Add, edit, and delete books
- Track book quantities and availability
- Categorize books by subject, category, language
- Store detailed book information (ISBN, author, publisher, edition, etc.)
- Shelf location tracking
- Book search and filtering

### 2. Book Issue System
- Issue books to students
- Automatic availability checking
- Prevent multiple issues of same book to same student
- Block issues if student has overdue books
- Set custom due dates (default: 14 days)
- Track issue history

### 3. Book Return System
- Process book returns
- Automatic fine calculation (Rs. 2 per day overdue)
- Track book condition (Returned, Lost, Damaged)
- Fine payment tracking
- Update book availability automatically

### 4. Library Reports
- **Overview Dashboard**: Total books, available, issued, overdue
- **Overdue Books Report**: List of overdue books with calculated fines
- **Popular Books Report**: Most frequently issued books
- **Fines Report**: Total fines, paid/unpaid amounts, transaction history

## File Structure

```
apps/web/
├── app/
│   ├── api/library/
│   │   ├── books/
│   │   │   ├── route.ts                    # GET/POST books
│   │   │   └── [id]/route.ts               # GET/PUT/DELETE single book
│   │   ├── issues/
│   │   │   ├── route.ts                    # GET/POST issues
│   │   │   └── [id]/return/route.ts        # PUT return book
│   │   └── reports/route.ts                # GET reports
│   │
│   └── (dashboard)/library/
│       ├── page.tsx                        # Library dashboard
│       ├── books/
│       │   ├── page.tsx                    # Book catalog list
│       │   ├── new/page.tsx                # Add new book
│       │   └── [id]/
│       │       ├── page.tsx                # Book details
│       │       └── edit/page.tsx           # Edit book
│       ├── issue/page.tsx                  # Issue book interface
│       ├── return/page.tsx                 # Return book interface
│       └── reports/page.tsx                # Library reports
│
└── components/library/
    ├── BookForm.tsx                        # Book add/edit form
    ├── BookCard.tsx                        # Book display card
    ├── BookTable.tsx                       # Books data table
    ├── IssueForm.tsx                       # Book issue form
    └── ReturnForm.tsx                      # Book return form
```

## API Endpoints

### Books
- `GET /api/library/books` - Get all books with pagination and filters
- `POST /api/library/books` - Create a new book
- `GET /api/library/books/[id]` - Get single book with issue history
- `PUT /api/library/books/[id]` - Update book details
- `DELETE /api/library/books/[id]` - Delete book (only if no active issues)

### Issues
- `GET /api/library/issues` - Get all book issues with filters
- `POST /api/library/issues` - Issue a book to student
- `PUT /api/library/issues/[id]/return` - Return a book

### Reports
- `GET /api/library/reports?type=overview` - Library overview statistics
- `GET /api/library/reports?type=overdue` - Overdue books report
- `GET /api/library/reports?type=popular` - Popular books report
- `GET /api/library/reports?type=fines` - Fines report

## Query Parameters

### GET /api/library/books
- `search` - Search by title, author, or ISBN
- `category` - Filter by category
- `available` - Filter available books only (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### GET /api/library/issues
- `status` - Filter by status (ISSUED, RETURNED, LOST, DAMAGED)
- `studentId` - Filter by student
- `overdue` - Show only overdue books (true/false)
- `page` - Page number
- `limit` - Items per page

## Fine Calculation

The system automatically calculates fines for overdue books:
- **Rate**: Rs. 2 per day
- **Calculation**: (Current Date - Due Date) × 2
- Fines are calculated when:
  - Viewing issued books list
  - Processing returns
  - Generating reports

## Business Rules

### Book Issue
1. Book must be available (availableQty > 0)
2. Student cannot have the same book already issued
3. Student must not have any overdue books
4. Book availability is decremented automatically

### Book Return
1. Book condition must be specified (Returned/Lost/Damaged)
2. Fine is calculated automatically if overdue
3. Book availability updates based on condition:
   - **Returned**: availableQty +1
   - **Lost**: quantity -1
   - **Damaged**: No change (book removed from circulation)

### Book Deletion
- Cannot delete books with active issues
- All returned/lost/damaged history is preserved

## Database Schema

### Book Model
```typescript
{
  id: string
  isbn?: string
  title: string
  author: string
  publisher?: string
  edition?: string
  category: string
  subject?: string
  language: string (default: "English")
  pages?: number
  price?: Decimal
  quantity: number
  availableQty: number
  shelfLocation?: string
  coverImage?: string
  description?: string
}
```

### BookIssue Model
```typescript
{
  id: string
  bookId: string
  studentId: string
  issueDate: DateTime
  dueDate: DateTime
  returnDate?: DateTime
  status: IssueStatus (ISSUED, RETURNED, LOST, DAMAGED)
  fineAmount: Decimal (default: 0)
  finePaid: boolean (default: false)
  issuedBy?: string
  returnedTo?: string
  remarks?: string
}
```

## Permissions

### Required Roles
- **View Books**: All authenticated users
- **Add/Edit/Delete Books**: ADMIN, SUPER_ADMIN, LIBRARIAN
- **Issue Books**: ADMIN, SUPER_ADMIN, LIBRARIAN
- **Return Books**: ADMIN, SUPER_ADMIN, LIBRARIAN
- **View Reports**: All authenticated users

## Usage Examples

### Adding a Book
1. Navigate to `/library/books/new`
2. Fill in book details (title, author, category are required)
3. Set quantity (default: 1)
4. Click "Add Book"

### Issuing a Book
1. Navigate to `/library/issue`
2. Search and select book
3. Search and select student
4. Set due date (default: 14 days from today)
5. Click "Issue Book"

### Returning a Book
1. Navigate to `/library/return`
2. Find the issued book in the list
3. Click "Return" button
4. Select book condition
5. Mark fine as paid if applicable
6. Click "Return Book"

### Viewing Reports
1. Navigate to `/library/reports`
2. Select report type:
   - Overdue Books - See all overdue items with fines
   - Popular Books - Most issued books
   - Fines - Fine collection summary

## Components

### BookForm
Reusable form component for adding/editing books.
- Props: `initialData` (optional), `bookId` (optional)
- Validates all fields using Zod
- Handles both create and update operations

### BookCard
Card component for displaying book information.
- Props: `book`, `onDelete` (optional)
- Shows book cover, title, author, category
- Quick action buttons (View, Edit, Delete)

### BookTable
Table component for listing books.
- Props: `books`
- Sortable columns
- Inline actions
- Deletion confirmation dialog

### IssueForm
Form component for issuing books.
- Auto-complete book and student search
- Validates availability
- Shows selected book/student details
- Configurable due date

### ReturnForm
Form component for processing returns.
- Props: `issue`
- Displays book and student information
- Calculates fines automatically
- Tracks book condition
- Fine payment checkbox

## Technical Details

### Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (via Prisma)
- **UI**: shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **State**: Server Components + API Routes
- **Styling**: Tailwind CSS

### Key Features
- Server-side rendering for better performance
- Optimistic UI updates
- Type-safe API with TypeScript
- Form validation with Zod schemas
- Responsive design
- Loading states with Suspense
- Error handling and user feedback

## Future Enhancements

Potential features for future development:
1. Barcode scanning for books
2. Email notifications for due dates
3. SMS reminders for overdue books
4. Book reservation system
5. Digital library (e-books)
6. Library card generation
7. Advanced analytics and charts
8. Bulk book import/export
9. Integration with academic curriculum
10. Mobile app for library access

## Support

For issues or questions, please contact the development team or create an issue in the project repository.
