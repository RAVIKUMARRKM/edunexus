'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo: string;
  className?: string;
}

export default function AddParentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students?limit=1000');
      if (response.ok) {
        const data = await response.json();
        // Map the API response to match our Student interface
        const mappedStudents = (data.data || []).map((student: any) => ({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          admissionNo: student.admissionNo,
          className: student.class?.name || student.section?.name
            ? `${student.class?.name || ''} ${student.section?.name || ''}`.trim()
            : undefined,
        }));
        setStudents(mappedStudents);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudent = (student: Student) => {
    if (selectedStudents.find((s) => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
    setSearchQuery('');
    setShowStudentList(false);
  };

  const removeStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error('Please select at least one child');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/parents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          childrenIds: selectedStudents.map((s) => s.id),
        }),
      });

      if (response.ok) {
        toast.success('Parent account created successfully!');
        router.push('/parents');
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create parent account');
      }
    } catch (error) {
      console.error('Create parent error:', error);
      toast.error('Failed to create parent account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/parents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Parent Account</h1>
          <p className="text-gray-600 mt-1">
            Create a new parent account with login credentials
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Parent Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="parent@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used for login
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Children Selection */}
            <div className="space-y-2">
              <Label htmlFor="children">Link Children *</Label>
              <div className="relative">
                <Input
                  id="children"
                  placeholder="Search and select students..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowStudentList(true);
                  }}
                  onFocus={() => setShowStudentList(true)}
                />

                {/* Student Dropdown */}
                {showStudentList && searchQuery && filteredStudents.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                          selectedStudents.find((s) => s.id === student.id)
                            ? 'bg-blue-50'
                            : ''
                        }`}
                        onClick={() => toggleStudent(student)}
                      >
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.admissionNo}
                          {student.className && ` • ${student.className}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Students */}
              {selectedStudents.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium">Selected Children:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full text-sm"
                      >
                        <span>
                          {student.firstName} {student.lastName}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeStudent(student.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudents.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Please select at least one child for this parent
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">About Parent Accounts</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Parent will receive login credentials via email</li>
                <li>• They can view their children's information</li>
                <li>• They can receive messages from teachers and admin</li>
                <li>• They can view notices and announcements</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/parents">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || selectedStudents.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Parent Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
