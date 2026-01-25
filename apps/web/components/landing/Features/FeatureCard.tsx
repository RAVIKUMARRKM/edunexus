'use client';

import { useState } from 'react';
import { LucideIcon, ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
  details: string[];
  delay?: number;
}

export default function FeatureCard({
  name,
  icon: Icon,
  description,
  details,
  delay = 0,
}: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon Badge */}
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
        <Icon className="h-8 w-8 text-primary" />
      </div>

      {/* Feature Name */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200"
      >
        <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expandable Details */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="space-y-2">
          {details.map((detail, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
