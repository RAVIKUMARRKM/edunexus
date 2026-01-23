'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  _count: {
    classes: number;
    exams: number;
  };
}

export default function AcademicYearPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await fetch('/api/settings/academic-year');
      if (response.ok) {
        const data = await response.json();
        setAcademicYears(data.academicYears || []);
      }
    } catch (error) {
      console.error('Failed to fetch academic years:', error);
      toast.error('Failed to load academic years');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/settings/academic-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Academic year created successfully!');
        setShowForm(false);
        setFormData({ name: '', startDate: '', endDate: '', isCurrent: false });
        fetchAcademicYears();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create academic year');
      }
    } catch (error) {
      console.error('Create academic year error:', error);
      toast.error('Failed to create academic year');
    } finally {
      setLoading(false);
    }
  };

  const setAsCurrent = async (id: string) => {
    try {
      const response = await fetch('/api/settings/academic-year', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCurrent: true }),
      });

      if (response.ok) {
        toast.success('Current academic year updated!');
        fetchAcademicYears();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update academic year');
      }
    } catch (error) {
      console.error('Update academic year error:', error);
      toast.error('Failed to update academic year');
    }
  };

  if (loading && academicYears.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading academic years...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Year</h1>
            <p className="text-gray-600 mt-1">
              Manage academic years and set the current active year
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Academic Year
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Academic Year</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 2024-2025"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) =>
                    setFormData({ ...formData, isCurrent: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isCurrent">Set as current academic year</Label>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Academic Years List */}
      <div className="space-y-4">
        {academicYears.length > 0 ? (
          academicYears.map((year) => (
            <Card key={year.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {year.name}
                      </h3>
                      {year.isCurrent && (
                        <Badge variant="success">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>
                        {new Date(year.startDate).toLocaleDateString()} -{' '}
                        {new Date(year.endDate).toLocaleDateString()}
                      </span>
                      <span>{year._count.classes} Classes</span>
                      <span>{year._count.exams} Exams</span>
                    </div>
                  </div>
                  {!year.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAsCurrent(year.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Set as Current
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-gray-600">No academic years found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Create your first academic year to get started
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
