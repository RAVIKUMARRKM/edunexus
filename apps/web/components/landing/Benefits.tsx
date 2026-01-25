import { benefits } from '@/lib/landing-data';
import { CheckCircle2 } from 'lucide-react';
import AnimatedSection from './shared/AnimatedSection';

export default function Benefits() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              EduNexus
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the difference with a platform built specifically for modern educational institutions
          </p>
        </AnimatedSection>

        {/* Benefits Grid */}
        <div className="space-y-20 md:space-y-32">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={benefit.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  isEven ? '' : 'lg:grid-flow-dense'
                }`}
              >
                {/* Content */}
                <AnimatedSection
                  animation={isEven ? 'slide-right' : 'slide-left'}
                  className={isEven ? '' : 'lg:col-start-2'}
                >
                  <div className="space-y-6">
                    {/* Icon Badge */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>

                    {/* Feature List */}
                    <ul className="space-y-3">
                      {benefit.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>

                {/* Image/Illustration Placeholder */}
                <AnimatedSection
                  animation={isEven ? 'slide-left' : 'slide-right'}
                  delay={200}
                  className={isEven ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
                    <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-12 flex items-center justify-center">
                      <Icon className="h-32 w-32 text-blue-500 dark:text-blue-400 opacity-50" />
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
