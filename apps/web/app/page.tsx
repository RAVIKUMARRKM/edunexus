import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, CreditCard, Bus, Building } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EduNexus</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Complete School
            <span className="text-primary"> Management</span> System
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Streamline your school operations with EduNexus. From student enrollment to
            fee collection, exam management to transport tracking - everything in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.name}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 rounded-2xl bg-primary p-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-12 border-t dark:border-gray-700">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">EduNexus</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2024 EduNexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    name: 'Student Management',
    description: 'Complete student lifecycle from admission to graduation with detailed profiles and records.',
    icon: Users,
  },
  {
    name: 'Academic Excellence',
    description: 'Manage classes, subjects, timetables, and examinations with comprehensive grading.',
    icon: BookOpen,
  },
  {
    name: 'Fee Management',
    description: 'Streamlined fee collection with multiple payment modes, receipts, and reminders.',
    icon: CreditCard,
  },
  {
    name: 'Transport Tracking',
    description: 'Real-time vehicle tracking, route management, and transport fee collection.',
    icon: Bus,
  },
  {
    name: 'Hostel Management',
    description: 'Room allocation, attendance, and fee management for residential students.',
    icon: Building,
  },
  {
    name: 'HR & Payroll',
    description: 'Staff management, attendance tracking, leave management, and salary processing.',
    icon: GraduationCap,
  },
];

const stats = [
  { value: '10K+', label: 'Schools' },
  { value: '1M+', label: 'Students' },
  { value: '50K+', label: 'Teachers' },
  { value: '99.9%', label: 'Uptime' },
];
