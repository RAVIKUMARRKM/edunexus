# Transport and Hostel Management Modules

This document describes the Transport and Hostel Management modules built for the EduNexus School Management System.

## Overview

Two complete modules have been implemented:
1. **Transport Management Module** - Manages vehicles, routes, stops, and student transport allocations
2. **Hostel Management Module** - Manages hostel buildings, rooms, and student room allocations

## Project Structure

### Transport Module

#### API Routes (`apps/web/app/api/transport/`)

1. **`/api/transport/vehicles/route.ts`**
   - `GET /api/transport/vehicles` - Fetch all vehicles (with optional status filter)
   - `POST /api/transport/vehicles` - Create a new vehicle
   - Handles vehicle management including driver details, insurance, and GPS tracking

2. **`/api/transport/routes/route.ts`**
   - `GET /api/transport/routes` - Fetch all routes with vehicle, stops, and student allocations
   - `POST /api/transport/routes` - Create a new route with vehicle assignment

3. **`/api/transport/routes/[id]/stops/route.ts`**
   - `GET /api/transport/routes/[id]/stops` - Fetch all stops for a specific route
   - `POST /api/transport/routes/[id]/stops` - Add a new stop to a route
   - Supports GPS coordinates, pickup/drop times, and fare management

4. **`/api/transport/allocations/route.ts`**
   - `GET /api/transport/allocations` - Fetch all student transport allocations
   - `POST /api/transport/allocations` - Allocate a student to a route and stop
   - Supports different pickup types (Pickup Only, Drop Only, Both)

#### Web Pages (`apps/web/app/(dashboard)/transport/`)

1. **`page.tsx`** - Transport Dashboard
   - Overview statistics (total vehicles, active vehicles, routes, allocations)
   - Quick action cards for navigation
   - Real-time data from API endpoints

2. **`vehicles/page.tsx`** - Vehicle Management
   - List all vehicles with search functionality
   - Add new vehicles with detailed form (driver, conductor, insurance, fitness)
   - Vehicle status badges (Active, Maintenance, Inactive)
   - GPS enabled indicator

3. **`routes/page.tsx`** - Routes Management
   - List all routes with vehicle assignments
   - Create new routes with start/end points
   - Display stops count and student allocations
   - Search and filter functionality

4. **`routes/[id]/page.tsx`** - Route Details
   - Detailed view of a specific route
   - Manage route stops with sequence
   - Add stops with pickup/drop times, fare, and GPS coordinates
   - View route statistics and vehicle information

5. **`allocations/page.tsx`** - Transport Allocations
   - Manage student transport assignments
   - Assign students to routes and specific stops
   - Configure pickup type (Both, Pickup Only, Drop Only)
   - Set validity periods for allocations

### Hostel Module

#### API Routes (`apps/web/app/api/hostel/`)

1. **`/api/hostel/buildings/route.ts`**
   - `GET /api/hostel/buildings` - Fetch all buildings with room statistics
   - `POST /api/hostel/buildings` - Create a new hostel building
   - Returns occupancy statistics and room availability

2. **`/api/hostel/rooms/route.ts`**
   - `GET /api/hostel/rooms` - Fetch all rooms with filters (building, status, type)
   - `POST /api/hostel/rooms` - Create a new room
   - Manages room capacity, rent, facilities, and status

3. **`/api/hostel/allocations/route.ts`**
   - `GET /api/hostel/allocations` - Fetch all room allocations
   - `POST /api/hostel/allocations` - Allocate a student to a room
   - Automatically updates room occupancy and status
   - Uses database transactions for data consistency

#### Web Pages (`apps/web/app/(dashboard)/hostel/`)

1. **`page.tsx`** - Hostel Dashboard
   - Overview statistics (buildings, rooms, capacity, occupancy rate)
   - Visual occupancy metrics
   - Quick navigation cards

2. **`buildings/page.tsx`** - Building Management
   - Card-based view of all buildings
   - Building type indicators (Boys, Girls, Staff)
   - Occupancy progress bars
   - Warden information display
   - Create new buildings with type and capacity

3. **`rooms/page.tsx`** - Room Management
   - Table view of all rooms with building information
   - Room type indicators (Single, Double, Triple, Dormitory)
   - Real-time capacity tracking (occupied/total)
   - Status badges (Available, Full, Maintenance)
   - Create rooms with floor, type, rent, and facilities

4. **`allocations/page.tsx`** - Room Allocations
   - Student room assignments
   - Display student and room details together
   - Bed number assignment
   - Join and leave date tracking
   - Only shows rooms with available capacity

## Database Schema Usage

The modules utilize the existing Prisma schema:

### Transport Tables
- `Vehicle` - Vehicle information and status
- `Route` - Route definitions with vehicle assignments
- `RouteStop` - Stop details with timing and fare
- `TransportAllocation` - Student transport assignments

### Hostel Tables
- `HostelBuilding` - Building information and capacity
- `HostelRoom` - Room details with occupancy tracking
- `HostelAllocation` - Student room assignments

## Features Implemented

### Transport Module Features
- Complete vehicle fleet management
- Route planning with multiple stops
- GPS coordinate support for stops
- Student transport allocation with pickup/drop preferences
- Insurance and fitness certificate tracking
- Driver and conductor management
- Real-time vehicle status tracking

### Hostel Module Features
- Multi-building hostel management
- Room type categorization (Single, Double, Triple, Dormitory)
- Gender-segregated buildings (Boys, Girls, Staff)
- Automatic occupancy calculation
- Room availability status management
- Bed-wise allocation
- Rent management per room
- Facilities tracking
- Warden assignment per building

## UI Components Used

All pages use shadcn/ui components:
- `Card` - For layout and content organization
- `Button` - For actions and navigation
- `Input` - For form fields
- `Label` - For form labels
- `Select` - For dropdown selections
- `Table` - For data display
- `Dialog` - For modal forms
- `Badge` - For status indicators
- `Progress` - For occupancy visualization
- `useToast` - For notifications

## API Response Format

All API endpoints follow a consistent response format:

**Success Response:**
```json
{
  "success": true,
  "data": [...]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Form Validation

All forms include:
- Required field validation
- Data type validation (numbers, dates)
- Unique constraint checking (vehicle numbers, room numbers, etc.)
- Existence validation (checking if referenced entities exist)

## Key Features

### Transport Module
1. **Vehicle Management**
   - Track vehicles with detailed information
   - Monitor insurance and fitness expiry dates
   - GPS tracking capability
   - Driver and conductor details

2. **Route Management**
   - Define routes with start and end points
   - Add multiple stops with sequence
   - Configure pickup and drop times per stop
   - Set fare per stop

3. **Student Allocations**
   - Assign students to specific routes and stops
   - Configure pickup preferences (pickup only, drop only, both)
   - Set validity periods
   - Track active allocations

### Hostel Module
1. **Building Management**
   - Categorize by type (Boys, Girls, Staff)
   - Track total capacity and occupancy
   - Assign wardens with contact information
   - Calculate occupancy rates

2. **Room Management**
   - Support multiple room types
   - Track available capacity in real-time
   - Set rent per room
   - Manage room status (Available, Full, Maintenance)
   - Store facilities information

3. **Student Allocations**
   - Assign students to specific rooms
   - Track bed numbers
   - Record join and leave dates
   - Automatic occupancy updates
   - Prevent over-allocation

## Search and Filter Capabilities

### Transport Module
- Vehicle search by number or driver name
- Route search by number, name, or location
- Allocation search by student name or admission number

### Hostel Module
- Building search by name or code
- Room search by number or building
- Allocation search by student details

## Data Relationships

### Transport Module
```
Vehicle → Route → RouteStop
                 ↘
                  TransportAllocation → Student
```

### Hostel Module
```
HostelBuilding → HostelRoom → HostelAllocation → Student
```

## Status Management

### Transport Statuses
- **Vehicle Status**: ACTIVE, MAINTENANCE, INACTIVE
- **Pickup Type**: BOTH, PICKUP_ONLY, DROP_ONLY
- **Allocation Status**: Active/Inactive

### Hostel Statuses
- **Room Status**: AVAILABLE, FULL, MAINTENANCE
- **Building Type**: BOYS, GIRLS, STAFF
- **Room Type**: SINGLE, DOUBLE, TRIPLE, DORMITORY
- **Allocation Status**: Active/Inactive

## Transaction Safety

The hostel allocation endpoint uses Prisma transactions to ensure:
1. Allocation is created
2. Room occupancy is incremented
3. Room status is updated if capacity is reached

All operations succeed or fail together, maintaining data consistency.

## Next Steps / Potential Enhancements

### Transport Module
1. Add route tracking with GPS
2. Implement attendance marking for transport
3. Add SMS notifications for pickup times
4. Generate transport fee reports
5. Add vehicle maintenance scheduling

### Hostel Module
1. Add hostel fee management
2. Implement visitor tracking
3. Add complaint management
4. Generate occupancy reports
5. Add mess/food management
6. Implement room change requests

## Testing

To test the modules:

1. **Start the development server:**
   ```bash
   cd /c/Users/Ravi\ Kumar/Apps/edunexus
   pnpm dev:web
   ```

2. **Access the modules:**
   - Transport: `http://localhost:3000/transport`
   - Hostel: `http://localhost:3000/hostel`

3. **Test sequence:**
   - Create vehicles → Create routes → Add stops → Allocate students
   - Create buildings → Create rooms → Allocate students

## File Locations

### Transport Module
- API: `C:/Users/Ravi Kumar/Apps/edunexus/apps/web/app/api/transport/`
- Pages: `C:/Users/Ravi Kumar/Apps/edunexus/apps/web/app/(dashboard)/transport/`

### Hostel Module
- API: `C:/Users/Ravi Kumar/Apps/edunexus/apps/web/app/api/hostel/`
- Pages: `C:/Users/Ravi Kumar/Apps/edunexus/apps/web/app/(dashboard)/hostel/`

## Dependencies

All required UI components are already installed:
- `@radix-ui/react-*` - UI primitives
- `class-variance-authority` - Styling utilities
- `lucide-react` - Icons
- `tailwindcss` - Styling

No additional dependencies are required.

## Notes

1. Student IDs must be entered manually in allocation forms (consider adding a student search/select component in future)
2. The Prisma client is imported from the database package: `@/../../packages/database/src`
3. All forms reset after successful submission
4. Toast notifications provide user feedback for all operations
5. Loading states are implemented for all data fetching operations
6. Error handling is implemented for all API calls
