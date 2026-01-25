import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Shield, Zap, Building2, TrendingUp, Play, BarChart3 } from 'lucide-react';
import ParticleBackground from './shared/ParticleBackground';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Mesh Pattern Overlay */}
      <div className="absolute inset-0 opacity-30" style={{ zIndex: 2 }}>
        <svg className="w-full h-full">
          <defs>
            <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-blue-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>

      {/* Header/Navigation */}
      <header className="relative container mx-auto px-4 py-6" style={{ zIndex: 10 }}>
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EduNexus</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] hover:bg-[position:100%_0%] transition-all duration-500">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="relative container mx-auto px-4 py-12 md:py-20" style={{ zIndex: 10 }}>
        <div className="text-center max-w-5xl mx-auto">
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              { icon: Zap, text: '15+ Modules' },
              { icon: TrendingUp, text: '99.9% Uptime' },
              { icon: Building2, text: '10K+ Schools' },
              { icon: Shield, text: 'SOC 2 Compliant' },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <badge.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Complete School
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
              Management System
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Transform your educational institution with 15+ integrated modules.
            From student enrollment to analytics, everything you need in one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button
                size="lg"
                className="px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="px-8 text-lg group border-2 hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-3xl opacity-30"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:scale-105 transition-transform duration-500 group">
              {/* Dashboard preview placeholder */}
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <BarChart3 className="h-16 w-16 md:h-24 md:w-24 mx-auto text-blue-500 mb-4 opacity-50" />
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
                    Real-time Dashboard Preview
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Analytics • Attendance • Fee Collection • And More
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
