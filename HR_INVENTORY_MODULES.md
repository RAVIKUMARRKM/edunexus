# HR/Payroll and Inventory Management Modules

This document provides an overview of the newly built HR/Payroll and Inventory Management modules for the EduNexus School Management System.

## Overview

Two complete modules have been built with full CRUD functionality, including:
- API routes for backend operations
- Frontend pages with responsive UI
- Integration with existing Prisma schema
- Authentication and authorization checks

---

## HR & PAYROLL MODULE

### API Routes

#### 1. Staff Management
**Location:** `apps/web/app/api/hr/staff/route.ts`

**Endpoints:**
- `GET /api/hr/staff` - Retrieve all staff members
  - Query params: `departmentId`, `status`
  - Returns staff with user info and department details

- `POST /api/hr/staff` - Create new staff member
  - Creates both User and Staff records in transaction
  - Validates employee ID and email uniqueness
  - Required fields: email, password, employeeId, firstName, lastName, designation, basicSalary

#### 2. Department Management
**Location:** `apps/web/app/api/hr/departments/route.ts`

**Endpoints:**
- `GET /api/hr/departments` - Retrieve all departments
  - Includes count of teachers and staff

- `POST /api/hr/departments` - Create new department
  - Required fields: name, code
  - Validates uniqueness of name and code

#### 3. Leave Management
**Location:** `apps/web/app/api/hr/leave/route.ts`

**Endpoints:**
- `GET /api/hr/leave` - Retrieve leave requests
  - Query params: `status`, `leaveType`
  - Returns leave requests with employee details

- `POST /api/hr/leave` - Create leave request
  - Automatically calculates number of days
  - Required fields: leaveType, startDate, endDate, reason
  - Must provide either teacherId or staffId

#### 4. Leave Approval
**Location:** `apps/web/app/api/hr/leave/[id]/approve/route.ts`

**Endpoints:**
- `PUT /api/hr/leave/[id]/approve` - Approve or reject leave
  - Status must be APPROVED or REJECTED
  - Records approver ID and timestamp

#### 5. Salary Management
**Location:** `apps/web/app/api/hr/salary/route.ts`

**Endpoints:**
- `GET /api/hr/salary` - Retrieve salary records
  - Query params: `staffId`, `month`, `status`

- `POST /api/hr/salary` - Create salary entry
  - Automatically calculates gross and net salary
  - Validates unique salary per staff per month

#### 6. Salary Processing
**Location:** `apps/web/app/api/hr/salary/process/route.ts`

**Endpoints:**
- `POST /api/hr/salary/process` - Process monthly salaries
  - Processes all active staff members
  - Auto-calculates: HRA (40%), DA (20%), TA (10%), PF (12%), Tax (10%)
  - Required fields: month, paymentMode

---

### Frontend Pages

#### 1. HR Dashboard
**Location:** `apps/web/app/(dashboard)/hr/page.tsx`

**Features:**
- Overview statistics: Total Staff, Active Staff, Pending Leaves, Monthly Salary
- Quick action links to all HR modules
- Recent activity section

#### 2. Staff Management
**Location:** `apps/web/app/(dashboard)/hr/staff/page.tsx`

**Features:**
- Complete staff list with search functionality
- Displays: Employee ID, Name, Designation, Department, Email, Phone, Salary, Status
- Status badges with color coding
- Filter by search query

#### 3. Department Management
**Location:** `apps/web/app/(dashboard)/hr/departments/page.tsx`

**Features:**
- Grid view of all departments
- Shows teacher and staff counts per department
- Inline form to add new departments
- Department cards with description

#### 4. Leave Management
**Location:** `apps/web/app/(dashboard)/hr/leave/page.tsx`

**Features:**
- Filter by status: ALL, PENDING, APPROVED, REJECTED
- Leave type badges with color coding
- Approve/Reject actions for pending leaves
- Displays employee details, duration, reason
- Leave type indicators (CASUAL, SICK, EARNED, etc.)

#### 5. Payroll Management
**Location:** `apps/web/app/(dashboard)/hr/payroll/page.tsx`

**Features:**
- Month selector for viewing salaries
- Summary cards: Total Gross, Total Deductions, Total Net
- Detailed salary breakdown per staff member
- Process salaries button for bulk processing
- Shows: Basic, HRA, DA, TA, Gross, PF, Tax, Net Salary

---

## INVENTORY MANAGEMENT MODULE

### API Routes

#### 1. Inventory Items
**Location:** `apps/web/app/api/inventory/items/route.ts`

**Endpoints:**
- `GET /api/inventory/items` - Retrieve all items
  - Query params: `categoryId`, `lowStock`
  - Returns items with category details

- `POST /api/inventory/items` - Create new item
  - Creates item and initial transaction record
  - Required fields: name, code, categoryId, unit, price
  - Validates unique item code

#### 2. Categories
**Location:** `apps/web/app/api/inventory/categories/route.ts`

**Endpoints:**
- `GET /api/inventory/categories` - Retrieve all categories
  - Includes item count per category

- `POST /api/inventory/categories` - Create new category
  - Required fields: name
  - Validates unique category name

#### 3. Vendor Management
**Location:** `apps/web/app/api/inventory/vendors/route.ts`

**Endpoints:**
- `GET /api/inventory/vendors` - Retrieve all vendors
  - Query params: `isActive`
  - Includes purchase order count

- `POST /api/inventory/vendors` - Create new vendor
  - Required fields: name, code, phone
  - Validates unique vendor code

#### 4. Purchase Orders
**Location:** `apps/web/app/api/inventory/purchase-orders/route.ts`

**Endpoints:**
- `GET /api/inventory/purchase-orders` - Retrieve all POs
  - Query params: `status`, `vendorId`
  - Returns POs with vendor and item details

- `POST /api/inventory/purchase-orders` - Create new PO
  - Auto-generates PO number (PO000001, PO000002, etc.)
  - Creates PO with multiple items in transaction
  - Required fields: vendorId, items array

---

### Frontend Pages

#### 1. Inventory Dashboard
**Location:** `apps/web/app/(dashboard)/inventory/page.tsx`

**Features:**
- Overview statistics: Total Items, Low Stock Items, Categories, Active Vendors
- Total inventory value display
- Quick action links to all inventory modules
- Low stock alert section

#### 2. Items Management
**Location:** `apps/web/app/(dashboard)/inventory/items/page.tsx`

**Features:**
- Complete item list with search functionality
- Low stock filter toggle
- Stock status badges (In Stock, Low Stock, Out of Stock)
- Displays: Code, Name, Category, Unit, Quantity, Price, Total Value, Location
- Low stock indicators with warning icons

#### 3. Vendor Management
**Location:** `apps/web/app/(dashboard)/inventory/vendors/page.tsx`

**Features:**
- Complete vendor list
- Inline form to add new vendors
- Displays: Code, Name, Contact Person, Phone, Email, GST, PAN, PO Count
- Active/Inactive status badges
- GST and PAN number tracking

#### 4. Purchase Orders
**Location:** `apps/web/app/(dashboard)/inventory/purchase-orders/page.tsx`

**Features:**
- Filter by status: ALL, DRAFT, PENDING_APPROVAL, APPROVED, ORDERED, RECEIVED
- Status badges with color coding
- Expandable PO details view
- Displays: PO Number, Vendor, Dates, Items Count, Total Amount
- Detailed item breakdown with received quantity tracking

---

## Database Schema Usage

### HR Module Tables
- **Staff** - Staff member details
- **Department** - Department organization
- **LeaveRequest** - Leave request tracking
- **Salary** - Monthly salary records
- **StaffAttendance** - Attendance tracking (schema ready)

### Inventory Module Tables
- **InventoryItem** - Item master data
- **InventoryCategory** - Item categorization
- **Vendor** - Vendor/supplier information
- **PurchaseOrder** - Purchase order headers
- **PurchaseOrderItem** - PO line items
- **InventoryTransaction** - Stock movement tracking

---

## Technology Stack

### Backend
- Next.js 14 App Router
- TypeScript
- Prisma ORM
- NextAuth for authentication
- PostgreSQL database

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

---

## UI Components Used

All pages utilize the following shadcn/ui components:
- **Card** - Container component
- **Button** - Actions and navigation
- **Input** - Form inputs
- **Label** - Form labels
- **Table** - Data display
- **Badge** - Status indicators
- **Select** - Dropdown selections (available for future use)
- **Dialog** - Modal dialogs (available for future use)

---

## Features Implemented

### HR Module
1. Staff CRUD operations with user account creation
2. Department management with employee counts
3. Leave request submission and approval workflow
4. Manual salary entry with automatic calculations
5. Bulk salary processing for all active staff
6. Status tracking for employees and leaves
7. Department-wise staff organization

### Inventory Module
1. Item management with stock tracking
2. Category-based organization
3. Low stock alerts and monitoring
4. Vendor management with contact details
5. Purchase order creation with multiple items
6. PO status workflow tracking
7. Total inventory value calculation
8. Stock movement transaction logging

---

## Security Features

1. **Authentication**: All API routes check for valid session
2. **Authorization**: Role-based access (can be extended)
3. **Data Validation**: Input validation on all POST/PUT requests
4. **Unique Constraints**: Prevents duplicate records
5. **Transaction Safety**: Critical operations use database transactions

---

## Future Enhancements

### HR Module
- Employee document upload
- Leave balance tracking
- Payslip generation and download
- Attendance management UI
- Performance review tracking
- Employee self-service portal

### Inventory Module
- Barcode/QR code integration
- Stock adjustment workflows
- Inventory reports and analytics
- Supplier performance tracking
- Purchase order approval workflow
- Stock transfer between locations
- Inventory audit trails

---

## API Response Formats

### Success Response
```json
{
  "id": "cuid",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

---

## Testing the Modules

### Prerequisites
1. Database must be set up and migrated
2. User must be logged in
3. At least one department should exist for HR operations
4. At least one category should exist for inventory operations

### Test Data Creation
1. Create departments first
2. Add staff members
3. Create inventory categories
4. Add inventory items
5. Create vendors
6. Generate purchase orders

---

## File Structure

```
apps/web/
├── app/
│   ├── api/
│   │   ├── hr/
│   │   │   ├── staff/route.ts
│   │   │   ├── departments/route.ts
│   │   │   ├── leave/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/approve/route.ts
│   │   │   └── salary/
│   │   │       ├── route.ts
│   │   │       └── process/route.ts
│   │   └── inventory/
│   │       ├── items/route.ts
│   │       ├── categories/route.ts
│   │       ├── vendors/route.ts
│   │       └── purchase-orders/route.ts
│   └── (dashboard)/
│       ├── hr/
│       │   ├── page.tsx
│       │   ├── staff/page.tsx
│       │   ├── departments/page.tsx
│       │   ├── leave/page.tsx
│       │   └── payroll/page.tsx
│       └── inventory/
│           ├── page.tsx
│           ├── items/page.tsx
│           ├── vendors/page.tsx
│           └── purchase-orders/page.tsx
└── components/
    └── ui/
        ├── button.tsx
        ├── card.tsx
        ├── input.tsx
        ├── label.tsx
        ├── table.tsx
        └── badge.tsx
```

---

## Conclusion

Both modules are fully functional and ready for use. They provide comprehensive HR and Inventory management capabilities for the EduNexus School Management System. The code follows Next.js 14 best practices, uses TypeScript for type safety, and integrates seamlessly with the existing Prisma schema.
