# Navigation Routes for HR & Inventory Modules

Add these routes to your sidebar/navigation component to enable access to the new modules.

## HR Module Navigation

```typescript
const hrRoutes = [
  {
    title: 'HR & Payroll',
    icon: 'Users', // or any HR-related icon
    children: [
      {
        title: 'Dashboard',
        href: '/hr',
        icon: 'LayoutDashboard'
      },
      {
        title: 'Staff',
        href: '/hr/staff',
        icon: 'Users'
      },
      {
        title: 'Departments',
        href: '/hr/departments',
        icon: 'Building'
      },
      {
        title: 'Leave Requests',
        href: '/hr/leave',
        icon: 'Calendar'
      },
      {
        title: 'Payroll',
        href: '/hr/payroll',
        icon: 'DollarSign'
      }
    ]
  }
]
```

## Inventory Module Navigation

```typescript
const inventoryRoutes = [
  {
    title: 'Inventory',
    icon: 'Package',
    children: [
      {
        title: 'Dashboard',
        href: '/inventory',
        icon: 'LayoutDashboard'
      },
      {
        title: 'Items',
        href: '/inventory/items',
        icon: 'Package'
      },
      {
        title: 'Vendors',
        href: '/inventory/vendors',
        icon: 'Store'
      },
      {
        title: 'Purchase Orders',
        href: '/inventory/purchase-orders',
        icon: 'ShoppingCart'
      }
    ]
  }
]
```

## Complete Navigation Structure

```typescript
// Example sidebar navigation structure
const navigation = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'Home'
  },
  {
    title: 'Students',
    icon: 'GraduationCap',
    children: [
      { title: 'All Students', href: '/students' },
      { title: 'Attendance', href: '/students/attendance' }
    ]
  },
  {
    title: 'Teachers',
    icon: 'Users',
    children: [
      { title: 'All Teachers', href: '/teachers' },
      { title: 'Subjects', href: '/teachers/subjects' }
    ]
  },
  {
    title: 'Academics',
    icon: 'BookOpen',
    children: [
      { title: 'Classes', href: '/classes' },
      { title: 'Exams', href: '/exams' },
      { title: 'Timetable', href: '/timetable' }
    ]
  },
  {
    title: 'Fees',
    icon: 'CreditCard',
    children: [
      { title: 'Fee Structure', href: '/fees' },
      { title: 'Payments', href: '/fees/payments' },
      { title: 'Concessions', href: '/fees/concessions' }
    ]
  },
  // NEW: HR Module
  {
    title: 'HR & Payroll',
    icon: 'Users',
    children: [
      { title: 'Dashboard', href: '/hr' },
      { title: 'Staff', href: '/hr/staff' },
      { title: 'Departments', href: '/hr/departments' },
      { title: 'Leave Requests', href: '/hr/leave' },
      { title: 'Payroll', href: '/hr/payroll' }
    ]
  },
  // NEW: Inventory Module
  {
    title: 'Inventory',
    icon: 'Package',
    children: [
      { title: 'Dashboard', href: '/inventory' },
      { title: 'Items', href: '/inventory/items' },
      { title: 'Vendors', href: '/inventory/vendors' },
      { title: 'Purchase Orders', href: '/inventory/purchase-orders' }
    ]
  },
  {
    title: 'Library',
    icon: 'Library',
    children: [
      { title: 'Books', href: '/library/books' },
      { title: 'Issue/Return', href: '/library/issue' }
    ]
  },
  {
    title: 'Transport',
    icon: 'Bus',
    children: [
      { title: 'Vehicles', href: '/transport/vehicles' },
      { title: 'Routes', href: '/transport/routes' }
    ]
  }
]
```

## Icon Mapping (Lucide React)

Import these icons from `lucide-react`:

```typescript
import {
  Home,
  GraduationCap,
  Users,
  BookOpen,
  CreditCard,
  Package,
  Library,
  Bus,
  LayoutDashboard,
  Building,
  Calendar,
  DollarSign,
  Store,
  ShoppingCart
} from 'lucide-react'
```

## Role-Based Access Control

If you want to restrict access by role:

```typescript
const hrModuleRoles = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'ACCOUNTANT']
const inventoryModuleRoles = ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'STAFF']

// Example usage in navigation component
const showHRModule = hrModuleRoles.includes(session?.user?.role)
const showInventoryModule = inventoryModuleRoles.includes(session?.user?.role)
```

## Mobile Navigation

For mobile responsive navigation:

```typescript
const mobileNavigation = [
  { title: 'Home', href: '/dashboard', icon: Home },
  { title: 'HR', href: '/hr', icon: Users },
  { title: 'Inventory', href: '/inventory', icon: Package },
  { title: 'More', href: '/menu', icon: Menu }
]
```

## Breadcrumb Configuration

```typescript
const breadcrumbs = {
  '/hr': ['Dashboard', 'HR & Payroll'],
  '/hr/staff': ['Dashboard', 'HR & Payroll', 'Staff'],
  '/hr/departments': ['Dashboard', 'HR & Payroll', 'Departments'],
  '/hr/leave': ['Dashboard', 'HR & Payroll', 'Leave Requests'],
  '/hr/payroll': ['Dashboard', 'HR & Payroll', 'Payroll'],
  '/inventory': ['Dashboard', 'Inventory'],
  '/inventory/items': ['Dashboard', 'Inventory', 'Items'],
  '/inventory/vendors': ['Dashboard', 'Inventory', 'Vendors'],
  '/inventory/purchase-orders': ['Dashboard', 'Inventory', 'Purchase Orders']
}
```

## Quick Stats for Dashboard

Add these stats to your main dashboard:

```typescript
const dashboardStats = [
  // ... existing stats
  {
    title: 'Total Staff',
    value: staffCount,
    icon: Users,
    href: '/hr/staff',
    color: 'blue'
  },
  {
    title: 'Pending Leaves',
    value: pendingLeaves,
    icon: Calendar,
    href: '/hr/leave',
    color: 'yellow'
  },
  {
    title: 'Inventory Items',
    value: itemCount,
    icon: Package,
    href: '/inventory/items',
    color: 'green'
  },
  {
    title: 'Low Stock Alerts',
    value: lowStockCount,
    icon: AlertTriangle,
    href: '/inventory/items?lowStock=true',
    color: 'red'
  }
]
```

## Search Integration

Add these routes to global search:

```typescript
const searchableRoutes = [
  // ... existing routes
  { title: 'HR Dashboard', url: '/hr', category: 'HR' },
  { title: 'Staff Management', url: '/hr/staff', category: 'HR' },
  { title: 'Departments', url: '/hr/departments', category: 'HR' },
  { title: 'Leave Requests', url: '/hr/leave', category: 'HR' },
  { title: 'Payroll', url: '/hr/payroll', category: 'HR' },
  { title: 'Inventory Dashboard', url: '/inventory', category: 'Inventory' },
  { title: 'Inventory Items', url: '/inventory/items', category: 'Inventory' },
  { title: 'Vendors', url: '/inventory/vendors', category: 'Inventory' },
  { title: 'Purchase Orders', url: '/inventory/purchase-orders', category: 'Inventory' }
]
```

## Notification Integration

Add these notification types:

```typescript
const notificationTypes = {
  // ... existing types
  LEAVE_REQUEST_PENDING: {
    title: 'New Leave Request',
    icon: Calendar,
    link: '/hr/leave'
  },
  LEAVE_REQUEST_APPROVED: {
    title: 'Leave Approved',
    icon: Check,
    link: '/hr/leave'
  },
  LOW_STOCK_ALERT: {
    title: 'Low Stock Alert',
    icon: AlertTriangle,
    link: '/inventory/items?lowStock=true'
  },
  PURCHASE_ORDER_CREATED: {
    title: 'New Purchase Order',
    icon: ShoppingCart,
    link: '/inventory/purchase-orders'
  },
  SALARY_PROCESSED: {
    title: 'Salary Processed',
    icon: DollarSign,
    link: '/hr/payroll'
  }
}
```

## Example Sidebar Component

```tsx
// components/layout/sidebar.tsx
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Package,
  LayoutDashboard,
  Building,
  Calendar,
  DollarSign,
  Store,
  ShoppingCart
} from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()

  const navigation = [
    // ... other nav items
    {
      title: 'HR & Payroll',
      icon: Users,
      children: [
        { title: 'Dashboard', href: '/hr', icon: LayoutDashboard },
        { title: 'Staff', href: '/hr/staff', icon: Users },
        { title: 'Departments', href: '/hr/departments', icon: Building },
        { title: 'Leave Requests', href: '/hr/leave', icon: Calendar },
        { title: 'Payroll', href: '/hr/payroll', icon: DollarSign }
      ]
    },
    {
      title: 'Inventory',
      icon: Package,
      children: [
        { title: 'Dashboard', href: '/inventory', icon: LayoutDashboard },
        { title: 'Items', href: '/inventory/items', icon: Package },
        { title: 'Vendors', href: '/inventory/vendors', icon: Store },
        { title: 'Purchase Orders', href: '/inventory/purchase-orders', icon: ShoppingCart }
      ]
    }
  ]

  return (
    <aside className="w-64 bg-white border-r">
      {navigation.map((section) => (
        <div key={section.title} className="py-4">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase">
            {section.title}
          </h3>
          <nav className="mt-2 space-y-1">
            {section.children.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}
    </aside>
  )
}

export default Sidebar
```

---

## Integration Checklist

- [ ] Add navigation items to sidebar
- [ ] Configure role-based access
- [ ] Update breadcrumbs
- [ ] Add to global search
- [ ] Configure notifications
- [ ] Add dashboard stats
- [ ] Test all navigation links
- [ ] Update mobile navigation
- [ ] Add keyboard shortcuts (optional)
- [ ] Update sitemap

Once navigation is integrated, users will be able to seamlessly access the HR and Inventory modules from the main dashboard.
