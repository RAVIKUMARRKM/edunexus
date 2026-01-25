import { securityFeatures, privacyFeatures } from '@/lib/landing-data';
import { CheckCircle2 } from 'lucide-react';
import AnimatedSection from './shared/AnimatedSection';

export default function Security() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Enterprise-Grade
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Security
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your data security is our top priority. We employ industry-leading practices to keep your information safe
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Security Badges */}
          <AnimatedSection animation="slide-right">
            <div className="grid grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Privacy Features */}
          <AnimatedSection animation="slide-left" delay={200}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Privacy & Compliance Features
              </h3>
              <ul className="space-y-4">
                {privacyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Trust Badge */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-primary">Trusted by 10,000+ schools</strong> worldwide.
                  Your data is encrypted, regularly backed up, and protected by industry-leading security measures.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
