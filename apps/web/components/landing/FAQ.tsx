'use client';

import { useState } from 'react';
import { faqs } from '@/lib/landing-data';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedSection from './shared/AnimatedSection';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Questions
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions? We have answers. Can't find what you're looking for?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </AnimatedSection>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <AnimatedSection
              key={index}
              animation="fade-up"
              delay={index * 50}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-300',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="px-6 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection className="text-center mt-16" delay={400}>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
