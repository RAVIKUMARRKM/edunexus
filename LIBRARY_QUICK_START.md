# Library Module - Quick Start Guide

## Setup Instructions

### 1. Database Setup
The library tables already exist in your Prisma schema. If you haven't run migrations yet:

```bash
cd packages/database
npx prisma migrate dev
npx prisma generate
```

### 2. Environment Variables
Ensure these are set in your `.env` file:

```env
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-direct-connection-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Start Development Server

```bash
cd apps/web
npm run dev
# or
pnpm dev
```

The library module will be available at: `http://localhost:3000/library`

## First Time Usage

### Step 1: Add Books to Catalog

1. Navigate to `/library/books/new`
2. Fill in book details:
   - **Required**: Title, Author, Category
   - **Optional**: ISBN, Publisher, Edition, Subject, Language, Pages, Price, Shelf Location, Description
3. Set quantity (how many copies)
4. Click "Add Book"

### Step 2: Issue a Book

1. Navigate to `/library/issue`
2. Click on "Issue New Book" tab
3. Search for a book (search is live as you type)
4. Search for a student
5. Set due date (defaults to 14 days from today)
6. Add optional remarks
7. Click "Issue Book"

### Step 3: Return a Book

1. Navigate to `/library/return`
2. Find the issued book in the table
3. Click "Return" button
4. Select book condition (Returned/Lost/Damaged)
5. If there's a fine, check "Fine has been paid" if applicable
6. Add optional remarks
7. Click "Return Book"

### Step 4: View Reports

1. Navigate to `/library/reports`
2. Choose from tabs:
   - **Overdue Books**: See all late returns with fines
   - **Popular Books**: Most frequently issued books
   - **Fines**: Financial summary of all fines

## Common Use Cases

### Use Case 1: Add Multiple Books
```
For adding many books, repeat the "Add Book" process or consider:
1. Creating a CSV template
2. Importing via API (future enhancement)
```

### Use Case 2: Check Book Availability
```
1. Go to /library/books
2. Search for the book by title, author, or ISBN
3. Check the "Available" column
```

### Use Case 3: Track Overdue Books
```
1. Go to /library/reports
2. Select "Overdue Books" tab
3. View list with student contact information
4. Sort by days overdue to prioritize
```

### Use Case 4: Generate Fine Report
```
1. Go to /library/reports
2. Select "Fines" tab
3. View summary cards showing:
   - Total fines collected
   - Paid amount
   - Unpaid amount
4. Scroll down for detailed transaction list
```

## API Usage Examples

### Add a Book via API

```typescript
const response = await fetch('/api/library/books', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    category: 'Fiction',
    language: 'English',
    quantity: 5,
    price: 299
  })
});

const book = await response.json();
```

### Issue a Book via API

```typescript
const response = await fetch('/api/library/issues', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookId: 'book-id-here',
    studentId: 'student-id-here',
    dueDate: '2024-02-15',
    remarks: 'Optional remarks'
  })
});

const issue = await response.json();
```

### Return a Book via API

```typescript
const response = await fetch('/api/library/issues/issue-id/return', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    condition: 'RETURNED', // or 'LOST', 'DAMAGED'
    finePaid: true,
    remarks: 'Book returned in good condition'
  })
});

const result = await response.json();
```

### Get Overdue Books Report

```typescript
const response = await fetch('/api/library/reports?type=overdue');
const data = await response.json();

console.log('Overdue books:', data.overdueIssues);
```

## Fine Calculation Formula

```
Fine Amount = Days Overdue × Rs. 2

Where:
- Days Overdue = Current Date - Due Date (in days)
- Rate = Rs. 2 per day (configurable in future)

Example:
- Due Date: Jan 1, 2024
- Return Date: Jan 15, 2024
- Days Overdue: 14 days
- Fine: 14 × 2 = Rs. 28
```

## Troubleshooting

### Issue: "Book not available"
**Solution**: Check the book's available quantity. If it's 0, all copies are issued.

### Issue: "Student already has this book issued"
**Solution**: The student cannot have duplicate issues of the same book. Return the existing copy first.

### Issue: "Student has overdue books"
**Solution**: Return all overdue books before issuing new ones. This enforces library discipline.

### Issue: "Cannot delete book with active issues"
**Solution**: All issued copies must be returned before deleting a book. Check the book details page for active issues.

### Issue: Student search not working in Issue form
**Solution**: Ensure you have created the `/api/students` endpoint. The IssueForm expects this API to exist.

## Access Control

### Who can do what:

| Action | ADMIN | SUPER_ADMIN | LIBRARIAN | TEACHER | STUDENT |
|--------|-------|-------------|-----------|---------|---------|
| View Books | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Books | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Books | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete Books | ✅ | ✅ | ✅ | ❌ | ❌ |
| Issue Books | ✅ | ✅ | ✅ | ❌ | ❌ |
| Return Books | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ |

## Tips & Best Practices

1. **Regular Audits**: Run the overdue report weekly to follow up with students
2. **Set Reminders**: Check reports 2-3 days before due dates to send reminders
3. **Shelf Organization**: Use consistent shelf location codes (e.g., A-12, B-05)
4. **Categories**: Maintain consistent category naming
5. **Damaged Books**: Mark damaged books appropriately to maintain inventory accuracy
6. **Fine Collection**: Always mark fines as paid when collecting to keep accurate records
7. **Book Quantity**: When adding books, set quantity = number of physical copies
8. **Lost Books**: When marking as lost, ensure fine covers book replacement cost

## Sample Data for Testing

### Sample Books to Add

1. **Fiction**
   - Title: To Kill a Mockingbird
   - Author: Harper Lee
   - Category: Fiction
   - Quantity: 3

2. **Science**
   - Title: A Brief History of Time
   - Author: Stephen Hawking
   - Category: Science
   - Quantity: 2

3. **Mathematics**
   - Title: Advanced Calculus
   - Author: R.D. Sharma
   - Category: Mathematics
   - Quantity: 5

## Performance Tips

1. **Pagination**: Use pagination for large book collections
2. **Search**: Utilize search instead of scrolling through all books
3. **Filters**: Use category filters to narrow down results
4. **Reports**: Generate reports during off-peak hours for large datasets

## Integration Points

The Library module integrates with:
- **Student Management**: For student information
- **User Management**: For authentication and permissions
- **Notification System**: (Future) For due date reminders

## Keyboard Shortcuts (Future Enhancement)

Planned shortcuts:
- `Ctrl + B`: Quick book search
- `Ctrl + I`: Open issue dialog
- `Ctrl + R`: Open return dialog

## Mobile Usage

The library module is fully responsive:
- Book catalog displays as cards on mobile
- Tables become scrollable
- Forms stack vertically
- All actions accessible via touch

## Backup & Data Export

While not yet implemented, consider:
1. Regular database backups
2. Export book catalog as CSV
3. Export issue history for archives
4. Backup fine collection records

## Getting Help

1. Check this Quick Start Guide
2. Review the LIBRARY_MODULE_README.md
3. Check API documentation in route files
4. Review component prop types
5. Contact development team

---

**Ready to use!** Navigate to `/library` to start managing your school library.
