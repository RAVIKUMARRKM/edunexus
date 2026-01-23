# EduNexus - School Lifecycle Management System

A comprehensive school management system built with modern technologies, featuring web and mobile applications.

![EduNexus](https://img.shields.io/badge/EduNexus-School%20Management-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)

## Features

### 13 Complete Modules

| Module | Description |
|--------|-------------|
| **Student Management** | Registration, enrollment, profiles, attendance tracking |
| **Teacher Management** | Profiles, assignments, attendance, performance |
| **Class & Section** | Class setup, timetable, subject allocation |
| **Examination** | Exam scheduling, grading, report cards |
| **Fee Management** | Fee structure, payments, receipts, concessions |
| **Library** | Book catalog, issue/return, fines |
| **Transport** | Routes, vehicle tracking, fee collection |
| **Hostel** | Room allocation, attendance, fee management |
| **Communication** | Notices, messaging, parent portal |
| **HR & Payroll** | Staff records, salary, leave management |
| **Inventory** | Stock management, purchase orders |
| **Reports** | Comprehensive analytics and dashboards |
| **Settings** | System configuration, academic year |

## Tech Stack

### Web Application
- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **State:** TanStack Query + Zustand
- **Auth:** NextAuth.js
- **Forms:** React Hook Form + Zod

### Mobile Application
- **Framework:** React Native + Expo
- **Navigation:** Expo Router
- **Styling:** NativeWind (Tailwind for RN)
- **State:** TanStack Query + Zustand

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma

### Monorepo
- **Build:** Turborepo
- **Package Manager:** pnpm

## Project Structure

```
edunexus/
├── apps/
│   ├── web/                 # Next.js Web Application
│   │   ├── app/
│   │   │   ├── (auth)/      # Auth pages
│   │   │   ├── (dashboard)/ # Dashboard pages
│   │   │   └── api/         # API routes
│   │   └── components/      # React components
│   │
│   └── mobile/              # React Native App
│       ├── app/             # Expo Router screens
│       └── components/      # RN components
│
├── packages/
│   ├── database/            # Prisma schema & client
│   ├── shared/              # Shared types, utils
│   └── ui/                  # Shared UI components
│
└── docs/                    # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL (or Supabase account)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/edunexus.git
cd edunexus
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Set up the database**
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

5. **Start development**
```bash
# Web app
pnpm dev:web

# Mobile app
pnpm dev:mobile
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edunexus.com | admin123 |
| Teacher | teacher1@edunexus.com | teacher123 |
| Student | student1@edunexus.com | student123 |
| Parent | parent1@edunexus.com | parent123 |

## Scripts

```bash
# Development
pnpm dev              # Start all apps
pnpm dev:web          # Start web app only
pnpm dev:mobile       # Start mobile app only

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed demo data
pnpm db:studio        # Open Prisma Studio

# Build
pnpm build            # Build all apps
pnpm build:web        # Build web app only
```

## Deployment

### Web (Vercel)
```bash
vercel
```

### Mobile (EAS)
```bash
cd apps/mobile
eas build --platform all
```

## API Documentation

API routes are available at `/api/*`:

| Endpoint | Description |
|----------|-------------|
| `/api/auth/*` | Authentication |
| `/api/students` | Student management |
| `/api/teachers` | Teacher management |
| `/api/classes` | Class management |
| `/api/exams` | Examination |
| `/api/fees` | Fee management |
| `/api/library` | Library management |
| `/api/transport` | Transport management |
| `/api/hostel` | Hostel management |
| `/api/hr` | HR & Payroll |
| `/api/inventory` | Inventory management |
| `/api/notices` | Communication |
| `/api/dashboard` | Dashboard stats |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with by the EduNexus Team
