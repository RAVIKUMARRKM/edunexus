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
    <div className="min-h-screen relative overflow-hidden bg-[#003d82]" style={{
      background: 'linear-gradient(to bottom right, rgb(0, 61, 130), rgb(0, 71, 160), rgb(0, 51, 102))'
    }}>
      {/* Unified background pattern for entire page */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Module icons */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 p-12">
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
                    className={`glossy-icon aspect-square rounded-3xl bg-gradient-to-br ${module.color} p-4 shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 cursor-pointer flex items-center justify-center group border border-white/20`}
                    title={module.label}
                    style={{
                      animation: `fall-from-top 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 0.04}s both`,
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 2px 8px 0 rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Icon className="h-8 w-8 text-white drop-shadow-2xl relative z-10" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md" style={{ animation: 'fade-slide-up 0.8s ease-out' }}>
            {/* Logo for mobile */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <GraduationCap className="h-10 w-10 text-white" />
              <span className="text-3xl font-bold text-white">edunexus</span>
            </div>

            {/* Login Card */}
            <div className="glossy-card rounded-2xl shadow-2xl p-8 md:p-10" style={{ animation: 'fade-slide-up 0.8s ease-out 0.1s both' }}>
              {/* Logo */}
              <div className="flex justify-center mb-8" style={{ animation: 'fade-slide-up 0.8s ease-out 0.2s both' }}>
                <div className="relative">
                  <div className="glossy-icon w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl border border-white/30">
                    <GraduationCap className="h-12 w-12 text-white drop-shadow-lg relative z-10" />
                  </div>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ animation: 'fade-slide-up 0.8s ease-out 0.3s both' }}>
                Login to get started
              </h2>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username/Email Field */}
                <div style={{ animation: 'fade-slide-up 0.8s ease-out 0.4s both' }}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Username"
                    {...register('email')}
                    disabled={isLoading}
                    className="h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white focus:bg-white/20"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-300 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative" style={{ animation: 'fade-slide-up 0.8s ease-out 0.5s both' }}>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    disabled={isLoading}
                    className="h-12 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 focus:border-white focus:bg-white/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-sm text-red-300 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Login Button */}
                <div style={{ animation: 'fade-slide-up 0.8s ease-out 0.6s both' }}>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-base border border-white/40 shadow-lg hover:shadow-xl transition-all"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Login
                  </Button>
                </div>

                {/* Forgot Password Link */}
                <div className="text-center" style={{ animation: 'fade-slide-up 0.8s ease-out 0.7s both' }}>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-white/90 hover:text-white hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>

            {/* Demo credentials hint */}
            <div className="relative mt-6 p-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg" style={{ animation: 'fade-slide-up 0.8s ease-out 0.8s both' }}>
              <p className="text-sm font-medium text-white mb-2">Demo Credentials:</p>
              <p className="text-xs text-white/80">Email: admin@edunexus.com</p>
              <p className="text-xs text-white/80">Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
