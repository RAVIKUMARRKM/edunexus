import { howItWorksSteps } from '@/lib/landing-data';
import AnimatedSection from './shared/AnimatedSection';
import { Clock } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in minutes and transform your school operations in four simple steps
          </p>
        </AnimatedSection>

        {/* Timeline - Desktop */}
        <div className="hidden lg:block relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 -translate-y-1/2"></div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimatedSection
                  key={step.number}
                  animation="scale"
                  delay={index * 150}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Number Badge */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Icon */}
                    <Icon className="h-12 w-12 text-primary mb-4" />

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {step.description}
                    </p>

                    {/* Time Indicator */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      {step.timeIndicator}
                    </div>

                    {/* Details */}
                    <ul className="mt-4 space-y-1">
                      {step.details.map((detail, i) => (
                        <li key={i} className="text-sm text-gray-500 dark:text-gray-400">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>

        {/* Timeline - Mobile/Tablet */}
        <div className="lg:hidden space-y-12">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimatedSection
                key={step.number}
                animation="fade-up"
                delay={index * 100}
                className="relative pl-12"
              >
                {/* Vertical Line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 -translate-x-1/2"></div>
                )}

                <div className="flex gap-6">
                  {/* Number Badge */}
                  <div className="relative flex-shrink-0 -ml-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <Icon className="h-10 w-10 text-primary mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {step.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-3">
                      <Clock className="h-4 w-4" />
                      {step.timeIndicator}
                    </div>
                    <ul className="space-y-1">
                      {step.details.map((detail, i) => (
                        <li key={i} className="text-sm text-gray-500 dark:text-gray-400">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
