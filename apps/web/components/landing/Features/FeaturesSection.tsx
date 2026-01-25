'use client';

import { useState } from 'react';
import { featureCategories } from '@/lib/landing-data';
import FeatureTabs from './FeatureTabs';
import FeatureCard from './FeatureCard';
import AnimatedSection from '../shared/AnimatedSection';

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(featureCategories[0].id);

  const activeCategory = featureCategories.find((cat) => cat.id === activeTab);

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Complete Management
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            15+ integrated modules covering every aspect of school operations.
            Streamline workflows and boost efficiency across your institution.
          </p>
        </AnimatedSection>

        {/* Feature Tabs */}
        <FeatureTabs
          tabs={featureCategories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Feature Cards Grid */}
        {activeCategory && (
          <div
            key={activeCategory.id}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500"
          >
            {activeCategory.features.map((feature, index) => (
              <AnimatedSection
                key={feature.name}
                animation="scale"
                delay={index * 100}
              >
                <FeatureCard
                  name={feature.name}
                  icon={feature.icon}
                  description={feature.description}
                  details={feature.details}
                  delay={index * 100}
                />
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Feature Count Badge */}
        <AnimatedSection className="mt-16 text-center" delay={400}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              15+
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Integrated Modules
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
