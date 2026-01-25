'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right';
  delay?: number;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  const animationClasses = {
    'fade-up': isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    'fade-in': isVisible ? 'opacity-100' : 'opacity-0',
    scale: isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    'slide-left': isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    'slide-right': isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        animationClasses[animation],
        className
      )}
    >
      {children}
    </div>
  );
}
