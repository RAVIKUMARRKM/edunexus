'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  GraduationCap,
  Loader2,
  Eye,
  EyeOff,
  Users,
  CreditCard,
  Calendar,
  FileText,
  BookOpen,
  Bus,
  Building2,
  Library,
  Briefcase,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  UserCheck,
  ClipboardList,
  Vote,
  UtensilsCrossed,
  BedDouble,
  Bell,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Module icons configuration
const moduleIcons = [
  { icon: CreditCard, color: 'from-blue-500 to-blue-600', label: 'Fee Management' },
  { icon: Calendar, color: 'from-orange-500 to-orange-600', label: 'Attendance' },
  { icon: FileText, color: 'from-green-500 to-green-600', label: 'Exams' },
  { icon: BarChart3, color: 'from-red-500 to-red-600', label: 'Reports' },
  { icon: ClipboardList, color: 'from-gray-600 to-gray-700', label: 'Assignments' },
  { icon: BookOpen, color: 'from-yellow-500 to-yellow-600', label: 'Academics' },
  { icon: Users, color: 'from-purple-500 to-purple-600', label: 'Students' },
  { icon: Bus, color: 'from-cyan-500 to-cyan-600', label: 'Transport' },
  { icon: Library, color: 'from-green-600 to-green-700', label: 'Library' },
  { icon: Vote, color: 'from-pink-500 to-pink-600', label: 'Voting' },
  { icon: UserCheck, color: 'from-blue-600 to-blue-700', label: 'Teachers' },
  { icon: Building2, color: 'from-indigo-500 to-indigo-600', label: 'Hostel' },
  { icon: Bell, color: 'from-red-600 to-red-700', label: 'Notices' },
  { icon: MessageSquare, color: 'from-green-500 to-green-600', label: 'Messages' },
  { icon: Briefcase, color: 'from-orange-600 to-orange-700', label: 'HR' },
  { icon: UtensilsCrossed, color: 'from-purple-600 to-purple-700', label: 'Canteen' },
  { icon: Package, color: 'from-yellow-600 to-yellow-700', label: 'Inventory' },
  { icon: BedDouble, color: 'from-blue-700 to-blue-800', label: 'Hostel Rooms' },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Login successful!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Blue background with module icons */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-[#003d82] via-[#0047a0] to-[#003366] relative overflow-hidden p-12">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center w-full">
          {/* Logo and tagline */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="h-12 w-12 text-white" />
              <h1 className="text-4xl font-bold text-white">
                edunexus<sup className="text-lg">®</sup>
              </h1>
            </div>
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-white/90 max-w-lg mx-auto leading-relaxed">
              An integrated platform for managing your educational institution.
            </p>
          </div>

          {/* Module Icons Grid */}
          <div className="grid grid-cols-6 gap-4 max-w-2xl mx-auto">
            {moduleIcons.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-3xl bg-gradient-to-br ${module.color} p-4 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer flex items-center justify-center group`}
                  title={module.label}
                >
                  <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-primary">edunexus</span>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Login to get started
            </h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username/Email Field */}
              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Username"
                  {...register('email')}
                  disabled={isLoading}
                  className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-primary"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password')}
                  disabled={isLoading}
                  className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#003d82] hover:bg-[#002d5f] text-white font-semibold text-base"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Login
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#003d82] hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">Email: admin@edunexus.com</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
