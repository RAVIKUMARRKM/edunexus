'use client';

import Link from 'next/link';
import {
  Settings,
  Calendar,
  Globe,
  Bell,
  Users,
  Shield,
  Database,
  Palette,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const settingsModules = [
  {
    icon: Globe,
    title: 'General Settings',
    description: 'Configure school name, logo, contact information, and basic settings',
    href: '/settings/general',
    color: 'blue',
  },
  {
    icon: Calendar,
    title: 'Academic Year',
    description: 'Manage academic years, terms, and set the current active year',
    href: '/settings/academic-year',
    color: 'green',
  },
  {
    icon: Users,
    title: 'User Roles & Permissions',
    description: 'Configure user roles, permissions, and access control',
    href: '/settings/roles',
    color: 'purple',
    disabled: true,
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Manage email, SMS, and push notification settings',
    href: '/settings/notifications',
    color: 'orange',
    disabled: true,
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Configure security settings, password policies, and 2FA',
    href: '/settings/security',
    color: 'red',
    disabled: true,
  },
  {
    icon: Database,
    title: 'Backup & Restore',
    description: 'Manage database backups and system restore points',
    href: '/settings/backup',
    color: 'indigo',
    disabled: true,
  },
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Customize theme, colors, and branding',
    href: '/settings/appearance',
    color: 'pink',
    disabled: true,
  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; icon: string }> = {
    blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
    green: { bg: 'bg-green-100', icon: 'text-green-600' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', icon: 'text-orange-600' },
    red: { bg: 'bg-red-100', icon: 'text-red-600' },
    indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600' },
    pink: { bg: 'bg-pink-100', icon: 'text-pink-600' },
  };
  return colors[color] || colors.blue;
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure and manage system settings
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsModules.map((module) => {
          const colors = getColorClasses(module.color);
          const Icon = module.icon;

          const CardWrapper = module.disabled ? 'div' : Link;
          const cardProps = module.disabled ? {} : { href: module.href };

          return (
            <CardWrapper key={module.title} {...cardProps}>
              <Card
                className={`hover:shadow-lg transition-shadow h-full ${
                  module.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 ${colors.bg} rounded-lg`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {module.title}
                        {module.disabled && (
                          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Version</p>
              <p className="text-lg font-semibold">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Environment</p>
              <p className="text-lg font-semibold">Production</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Database</p>
              <p className="text-lg font-semibold">PostgreSQL</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
