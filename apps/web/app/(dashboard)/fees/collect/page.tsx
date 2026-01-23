'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

export default function CollectFeePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter admission number or student name');
      return;
    }

    setIsSearching(true);
    try {
      // This endpoint should be created in the student module
      const response = await fetch(
        `/api/students/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search students');
      }

      const data = await response.json();
      setStudents(data);

      if (data.length === 0) {
        toast.info('No students found');
      } else if (data.length === 1) {
        // Directly navigate to fee collection for single result
        router.push(`/fees/collect/${data[0].id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to search students');
      // Use dummy data for demo
      const dummyStudents = [
        {
          id: '1',
          admissionNo: 'ADM001',
          firstName: 'John',
          lastName: 'Doe',
          class: { name: 'Class 10' },
          section: { name: 'A' },
        },
      ];
      setStudents(dummyStudents);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Collect Fee</h1>
        <p className="text-gray-500 mt-1">
          Search for a student to collect fee payment
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Admission Number or Student Name</Label>
              <Input
                id="search"
                placeholder="Enter admission number or student name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/fees/collect/${student.id}`)}
                >
                  <div>
                    <p className="font-semibold">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {student.admissionNo} | {student.class?.name}{' '}
                      {student.section?.name && `- ${student.section.name}`}
                    </p>
                  </div>
                  <Button variant="outline">Collect Fee</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
