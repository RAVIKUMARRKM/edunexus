'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateNoticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'GENERAL',
    targetRoles: [] as string[],
    expiresAt: '',
    isPublished: false,
  });

  const noticeTypes = [
    { value: 'GENERAL', label: 'General' },
    { value: 'ACADEMIC', label: 'Academic' },
    { value: 'EXAM', label: 'Exam' },
    { value: 'EVENT', label: 'Event' },
    { value: 'HOLIDAY', label: 'Holiday' },
    { value: 'EMERGENCY', label: 'Emergency' },
    { value: 'FEE_REMINDER', label: 'Fee Reminder' },
  ];

  const roles = [
    { value: 'STUDENT', label: 'Students' },
    { value: 'PARENT', label: 'Parents' },
    { value: 'TEACHER', label: 'Teachers' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'ADMIN', label: 'Admins' },
    { value: 'PRINCIPAL', label: 'Principal' },
  ];

  const allRoleValues = roles.map(r => r.value);

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isPublished: publish,
        }),
      });

      if (response.ok) {
        toast.success(publish ? 'Notice published successfully!' : 'Notice saved as draft!');
        router.push('/communication/notices');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create notice');
      }
    } catch (error) {
      console.error('Create notice error:', error);
      toast.error('Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const selectAllRoles = () => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: allRoleValues,
    }));
  };

  const clearAllRoles = () => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: [],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/communication/notices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Notice</h1>
          <p className="text-gray-600 mt-1">
            Post a new notice or announcement
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, true)}>
        <Card>
          <CardHeader>
            <CardTitle>Notice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter notice title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Enter notice content"
                rows={8}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Notice Type *</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                {noticeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Roles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Target Audience *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={selectAllRoles}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAllRoles}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <Button
                    key={role.value}
                    type="button"
                    variant={
                      formData.targetRoles.includes(role.value)
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => toggleRole(role.value)}
                  >
                    {role.label}
                  </Button>
                ))}
              </div>
              {formData.targetRoles.length === 0 && (
                <p className="text-sm text-red-500">
                  Please select at least one target audience
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
              />
              <p className="text-sm text-gray-500">
                Leave empty for notices that don't expire
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/communication/notices">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading || formData.targetRoles.length === 0}
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={loading || formData.targetRoles.length === 0}
              >
                {loading ? 'Publishing...' : 'Publish Notice'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
