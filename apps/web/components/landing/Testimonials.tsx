'use client';

import { testimonials } from '@/lib/landing-data';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AnimatedSection from './shared/AnimatedSection';

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Educators
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See what school administrators, teachers, and staff have to say about their experience with EduNexus
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={testimonial.id}
              animation="scale"
              delay={index * 150}
            >
              <div className="relative bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 h-full border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-6 h-12 w-12 text-blue-500/10" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                      {testimonial.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {testimonial.school}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Call to Action */}
        <AnimatedSection className="text-center mt-16" delay={500}>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join thousands of satisfied customers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-6 w-6 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              4.9/5
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              from 2,500+ reviews
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
