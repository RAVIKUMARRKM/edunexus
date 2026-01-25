'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureTab {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface FeatureTabsProps {
  tabs: FeatureTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function FeatureTabs({ tabs, activeTab, onTabChange }: FeatureTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 md:px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium',
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary hover:scale-105'
            )}
          >
            <Icon className={cn('h-5 w-5', isActive && 'animate-pulse')} />
            <span className="hidden sm:inline">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
