'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';

interface Settings {
  school_name: string;
  school_email: string;
  school_phone: string;
  school_address: string;
  school_website: string;
  school_motto: string;
  school_logo: string;
  academic_session_start_month: string;
  timezone: string;
  currency: string;
  date_format: string;
  time_format: string;
}

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    school_name: '',
    school_email: '',
    school_phone: '',
    school_address: '',
    school_website: '',
    school_motto: '',
    school_logo: '',
    academic_session_start_month: 'April',
    timezone: 'UTC',
    currency: 'USD',
    date_format: 'MM/DD/YYYY',
    time_format: '12',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=general');
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure basic school information and system preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Information */}
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school_name">School Name *</Label>
                <Input
                  id="school_name"
                  placeholder="Enter school name"
                  value={settings.school_name}
                  onChange={(e) =>
                    setSettings({ ...settings, school_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_email">Email *</Label>
                <Input
                  id="school_email"
                  type="email"
                  placeholder="school@example.com"
                  value={settings.school_email}
                  onChange={(e) =>
                    setSettings({ ...settings, school_email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_phone">Phone *</Label>
                <Input
                  id="school_phone"
                  placeholder="+1 234 567 8900"
                  value={settings.school_phone}
                  onChange={(e) =>
                    setSettings({ ...settings, school_phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_website">Website</Label>
                <Input
                  id="school_website"
                  placeholder="https://school.com"
                  value={settings.school_website}
                  onChange={(e) =>
                    setSettings({ ...settings, school_website: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="school_address">Address</Label>
              <Textarea
                id="school_address"
                placeholder="Enter complete school address"
                rows={3}
                value={settings.school_address}
                onChange={(e) =>
                  setSettings({ ...settings, school_address: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school_motto">School Motto</Label>
              <Input
                id="school_motto"
                placeholder="Enter school motto or tagline"
                value={settings.school_motto}
                onChange={(e) =>
                  setSettings({ ...settings, school_motto: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academic_session_start_month">
                  Academic Session Start Month
                </Label>
                <select
                  id="academic_session_start_month"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={settings.academic_session_start_month}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      academic_session_start_month: e.target.value,
                    })
                  }
                >
                  {[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Asia/Kolkata">India Standard Time</option>
                  <option value="Europe/London">London</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_format">Date Format</Label>
                <select
                  id="date_format"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={settings.date_format}
                  onChange={(e) =>
                    setSettings({ ...settings, date_format: e.target.value })
                  }
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_format">Time Format</Label>
                <select
                  id="time_format"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={settings.time_format}
                  onChange={(e) =>
                    setSettings({ ...settings, time_format: e.target.value })
                  }
                >
                  <option value="12">12 Hour</option>
                  <option value="24">24 Hour</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
