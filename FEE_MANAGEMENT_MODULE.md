# Fee Management Module - EduNexus

Complete fee management system for school administration with payment tracking, receipt generation, and comprehensive reporting.

## Features Implemented

### 1. Fee Structure Management
- Create and manage multiple fee structures
- Support for different fee types (Tuition, Transport, Hostel, etc.)
- Configurable payment frequencies (Monthly, Quarterly, Yearly, etc.)
- Class-specific or global fee structures
- Late fee configuration
- Optional fee marking

### 2. Payment Collection
- Student search by admission number or name
- Real-time fee status display
- Multiple payment modes support (Cash, Card, UPI, Net Banking, Cheque, DD)
- Automatic receipt number generation
- Partial payment support
- Discount and late fee calculation
- Transaction ID tracking for digital payments

### 3. Fee Concessions
- Multiple concession types (Scholarship, Sibling Discount, Merit-Based, etc.)
- Percentage or fixed amount discounts
- Time-bound validity
- Approval tracking

### 4. Receipt Management
- Professional printable receipts
- Automatic receipt number generation (Format: RCP{YY}{MM}{0001})
- Complete payment details
- School branding with logo
- Digital and print-ready format

### 5. Reports & Analytics
- **Collection Summary**: Total collections by fee type
- **Payment Mode Report**: Distribution and analysis by payment method
- **Class-wise Report**: Fee collection breakdown by class
- **Monthly Collection**: Year-wise trend analysis
- **Defaulters Report**: Students with pending fees
- Visual charts using Recharts

## File Structure

```
apps/web/
├── app/
│   ├── api/fees/
│   │   ├── structures/route.ts          # Fee structure CRUD
│   │   ├── payments/route.ts            # Payment recording
│   │   ├── status/[studentId]/route.ts  # Student fee status
│   │   ├── receipt/[paymentId]/route.ts # Receipt data
│   │   ├── concessions/route.ts         # Concession management
│   │   └── reports/route.ts             # Report generation
│   │
│   └── (dashboard)/fees/
│       ├── page.tsx                     # Fee dashboard
│       ├── structures/page.tsx          # Fee structures list
│       ├── collect/
│       │   ├── page.tsx                 # Student search
│       │   └── [studentId]/page.tsx     # Fee collection interface
│       ├── receipts/
│       │   ├── page.tsx                 # Receipts list
│       │   └── [id]/page.tsx            # Receipt view/print
│       └── reports/page.tsx             # Reports dashboard
│
└── components/fees/
    ├── FeeStructureForm.tsx             # Fee structure creation form
    ├── PaymentForm.tsx                  # Payment collection form
    ├── FeeStatusCard.tsx                # Student fee status card
    ├── Receipt.tsx                      # Printable receipt component
    └── FeeReport.tsx                    # Report visualization component
```

## API Endpoints

### Fee Structures
- `GET /api/fees/structures` - List all fee structures
  - Query params: `academicYearId`, `classId`, `feeType`
- `POST /api/fees/structures` - Create new fee structure

### Payments
- `GET /api/fees/payments` - List all payments
  - Query params: `studentId`, `status`, `fromDate`, `toDate`
- `POST /api/fees/payments` - Record new payment

### Fee Status
- `GET /api/fees/status/[studentId]` - Get complete fee status for a student
  - Returns: Fee structures, payments, concessions, balances

### Receipts
- `GET /api/fees/receipt/[paymentId]` - Get receipt data for printing

### Concessions
- `GET /api/fees/concessions` - List concessions
  - Query params: `studentId`, `feeStructureId`
- `POST /api/fees/concessions` - Create new concession

### Reports
- `GET /api/fees/reports` - Generate reports
  - Query param: `type` (collection-summary, payment-mode, class-wise, monthly-collection, defaulters)
  - Optional params: `fromDate`, `toDate`, `classId`

## Receipt Number Generation

Automatic receipt number generation with format: `RCP{YY}{MM}{XXXX}`
- YY: Last 2 digits of year
- MM: Month (01-12)
- XXXX: Sequential number (0001-9999)

Example: `RCP2601` for January 2026, receipt #1

## Payment Calculations

### Total Amount Calculation
```
Total Amount = Fee Amount + Late Fee - Discount
```

### Due Amount Calculation
```
Due Amount = Total Amount - Paid Amount
```

### Payment Status
- **COMPLETED**: Due Amount = 0
- **PENDING**: Due Amount > 0

### Concession Application
Concessions can be:
- Fixed amount: Direct deduction from fee
- Percentage: Calculated on fee amount

## Database Schema Usage

### Models Used
- `FeeStructure` - Fee definitions
- `FeePayment` - Payment records
- `FeeConcession` - Discount records
- `Student` - Student information
- `Class` - Class information
- `AcademicYear` - Academic year data
- `SystemSetting` - School information for receipts

### Enums Used
- `FeeType`: TUITION, ADMISSION, TRANSPORT, HOSTEL, LIBRARY, LABORATORY, SPORTS, EXAM, OTHER
- `FeeFrequency`: ONE_TIME, MONTHLY, QUARTERLY, HALF_YEARLY, YEARLY
- `PaymentMode`: CASH, CARD, UPI, NET_BANKING, CHEQUE, DD
- `PaymentStatus`: PENDING, COMPLETED, FAILED, REFUNDED
- `ConcessionType`: SCHOLARSHIP, SIBLING_DISCOUNT, STAFF_WARD, MERIT_BASED, FINANCIAL_AID, OTHER

## UI Components

### shadcn/ui Components Used
- Button
- Card
- Input
- Label
- Select
- Table
- Tabs
- Dialog
- Badge
- Separator
- Skeleton
- Toast (sonner)

### Chart Library
- Recharts for data visualization
  - BarChart
  - LineChart
  - PieChart

## Features Details

### Fee Structure Form
- Multi-step validation using Zod
- Dynamic fee type selection
- Class-specific or global assignment
- Frequency-based configuration
- Late fee setup

### Payment Form
- Real-time total calculation
- Payment mode validation
- Transaction ID tracking for non-cash payments
- Month-wise payment tracking
- Discount and late fee support

### Fee Status Display
- Visual progress bars
- Color-coded status (Paid/Partial/Unpaid)
- Concession details
- Balance calculations
- Payment history

### Receipt Component
- Professional layout
- School branding
- Complete payment breakdown
- Print-optimized CSS
- Computer-generated receipt note

### Report Charts
- Interactive visualizations
- Multiple chart types
- Summary statistics
- Exportable data (placeholder)

## Security & Permissions

### Role-Based Access
- **ADMIN/SUPER_ADMIN/ACCOUNTANT**: Full access to all features
- **PRINCIPAL**: Can create concessions
- **Others**: View-only access (based on implementation)

### Data Validation
- Server-side validation using Zod
- Client-side form validation
- Input sanitization
- Error handling

## Usage Guide

### Creating a Fee Structure
1. Navigate to Fees > Fee Structures
2. Click "Create Fee Structure"
3. Fill in the form:
   - Name (e.g., "Tuition Fee")
   - Fee Type
   - Academic Year
   - Class (optional for global fees)
   - Amount
   - Frequency
   - Due Day
   - Late Fee (optional)
4. Submit to create

### Collecting Fee Payment
1. Navigate to Fees > Collect Fee
2. Search for student by admission number or name
3. Select student from results
4. View fee status and pending amounts
5. Fill payment form:
   - Select fee type
   - Verify amount
   - Apply discount (if any)
   - Add late fee (if applicable)
   - Enter paid amount
   - Select payment mode
   - Add transaction ID (for digital payments)
   - Select month
6. Submit to record payment
7. Receipt is generated automatically

### Viewing Receipts
1. Navigate to Fees > Receipts
2. Search by receipt number, student name, or admission number
3. Filter by date range
4. Click "View" to see receipt
5. Click "Print Receipt" to print

### Generating Reports
1. Navigate to Fees > Reports
2. Select report type:
   - Collection Summary
   - Payment Mode Wise
   - Class Wise
   - Monthly Collection
   - Defaulters
3. Set filters (date range, class)
4. Click "Generate Report"
5. View charts and statistics
6. Export report (feature placeholder)

## Integration Points

### Required External APIs
These endpoints should be created in respective modules:

1. **Academic Module**
   - `GET /api/academic/years` - List academic years

2. **Student Module**
   - `GET /api/students/search?q={query}` - Search students

3. **Class Module**
   - `GET /api/classes` - List classes

### Database Connection
Uses `@edunexus/database` package with Prisma client.

## Next Steps / Enhancements

### Recommended Additions
1. **Email Notifications**
   - Receipt email to parents
   - Payment reminders
   - Due date alerts

2. **SMS Integration**
   - Payment confirmation SMS
   - Fee reminder SMS

3. **Online Payment Gateway**
   - Razorpay/PayU integration
   - Online payment tracking

4. **Bulk Operations**
   - Bulk fee structure assignment
   - Bulk concession application
   - Bulk receipt generation

5. **Advanced Reports**
   - Excel/PDF export
   - Custom report builder
   - Scheduled reports

6. **Fee Installments**
   - Installment plans
   - Auto-calculation
   - Installment tracking

7. **Refund Management**
   - Fee refund processing
   - Refund receipts
   - Refund reports

8. **Dashboard Analytics**
   - Real-time collection stats
   - Collection vs target
   - Trend analysis

## Dependencies

### Required Packages (Already in package.json)
- `next`: 14.1.0
- `react`: ^18.2.0
- `react-hook-form`: ^7.50.0
- `@hookform/resolvers`: ^3.3.4
- `zod`: ^3.22.0
- `recharts`: ^2.12.0
- `date-fns`: ^3.3.1
- `sonner`: ^1.4.0
- `lucide-react`: ^0.344.0
- `@edunexus/database`: workspace:*

### shadcn/ui Components
All required UI components are already installed.

## Testing Checklist

- [ ] Fee structure creation
- [ ] Fee structure listing with filters
- [ ] Student search functionality
- [ ] Fee status calculation
- [ ] Payment recording with all modes
- [ ] Receipt number generation
- [ ] Receipt printing
- [ ] Discount application
- [ ] Late fee calculation
- [ ] Concession creation
- [ ] All report types
- [ ] Defaulters report
- [ ] Role-based access control

## Troubleshooting

### Common Issues

1. **Receipt number generation fails**
   - Check database connection
   - Verify FeePayment table access

2. **Reports showing no data**
   - Verify date filters
   - Check if payments exist in database

3. **Student search not working**
   - Implement `/api/students/search` endpoint
   - Check student data in database

4. **Print not working**
   - Check browser print settings
   - Verify CSS print media queries

## Support

For issues or questions:
1. Check the implementation files
2. Verify database schema matches Prisma schema
3. Check console for error messages
4. Verify API responses in network tab

## License

Part of EduNexus School Management System
