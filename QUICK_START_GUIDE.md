# Quick Start Guide - Transport and Hostel Modules

## Getting Started

### 1. Start the Development Server

```bash
cd "C:/Users/Ravi Kumar/Apps/edunexus"
pnpm dev:web
```

The application will start at: `http://localhost:3000`

---

## Transport Module

### Access URLs

- **Dashboard**: http://localhost:3000/transport
- **Vehicles**: http://localhost:3000/transport/vehicles
- **Routes**: http://localhost:3000/transport/routes
- **Allocations**: http://localhost:3000/transport/allocations

### Quick Setup Steps

1. **Add a Vehicle** → Navigate to Vehicles → Click "Add Vehicle" → Fill form
2. **Create a Route** → Navigate to Routes → Click "Add Route" → Assign vehicle
3. **Add Stops** → Open route details → Click "Add Stop" → Fill timing and fare
4. **Allocate Students** → Navigate to Allocations → Assign student to route

---

## Hostel Module

### Access URLs

- **Dashboard**: http://localhost:3000/hostel
- **Buildings**: http://localhost:3000/hostel/buildings
- **Rooms**: http://localhost:3000/hostel/rooms
- **Allocations**: http://localhost:3000/hostel/allocations

### Quick Setup Steps

1. **Add Building** → Navigate to Buildings → Click "Add Building" → Fill details
2. **Create Rooms** → Navigate to Rooms → Click "Add Room" → Assign to building
3. **Allocate Students** → Navigate to Allocations → Assign student to room

---

For detailed documentation, see `TRANSPORT_HOSTEL_MODULES.md`
