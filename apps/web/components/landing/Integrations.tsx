import { integrations } from '@/lib/landing-data';
import { Zap } from 'lucide-react';
import AnimatedSection from './shared/AnimatedSection';

export default function Integrations() {
  const categories = Array.from(new Set(integrations.map((i) => i.category)));

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Works With Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Existing Tools
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Seamlessly integrate with popular payment gateways, communication services, and cloud platforms
          </p>
        </AnimatedSection>

        {/* Integration Categories */}
        <div className="space-y-12">
          {categories.map((category, catIndex) => (
            <div key={category}>
              <AnimatedSection delay={catIndex * 100}>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center">
                  {category} Services
                </h3>
              </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {integrations
                  .filter((integration) => integration.category === category)
                  .map((integration, index) => (
                    <AnimatedSection
                      key={integration.name}
                      animation="scale"
                      delay={catIndex * 100 + index * 50}
                    >
                      <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-lg transition-all duration-300">
                        <div className="aspect-square flex items-center justify-center">
                          <div className="text-center">
                            <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Zap className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                              {integration.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* API Badge */}
        <AnimatedSection className="text-center mt-16" delay={400}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg">
            <Zap className="h-5 w-5" />
            API Available for Custom Integrations
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
