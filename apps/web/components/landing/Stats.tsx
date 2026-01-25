'use client';

import { stats } from '@/lib/landing-data';
import CountUp from './shared/CountUp';
import AnimatedSection from './shared/AnimatedSection';

export default function Stats() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient-shift"></div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="stats-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="currentColor" className="text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join the growing community of educational institutions that have transformed their operations with EduNexus
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedSection
                key={stat.label}
                animation="scale"
                delay={index * 100}
                className="text-center"
              >
                <div className="flex flex-col items-center">
                  {/* Icon */}
                  <Icon className="h-8 w-8 md:h-10 md:w-10 text-blue-200 mb-4" />

                  {/* Number with CountUp */}
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-sm md:text-base text-blue-100 font-medium">
                    {stat.label}
                  </p>
                </div>

                {/* Separator (hidden on last item) */}
                {index < stats.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/20"></div>
                )}
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
