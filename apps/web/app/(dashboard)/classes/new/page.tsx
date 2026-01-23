'use client';

import { useQuery } from '@tanstack/react-query';
import { ClassForm } from '@/components/classes/ClassForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function fetchAcademicYears() {
  const response = await fetch('/api/academic-years');
  if (!response.ok) {
    throw new Error('Failed to fetch academic years');
  }
  return response.json();
}

async function fetchTeachers() {
  const response = await fetch('/api/teachers?status=ACTIVE');
  if (!response.ok) {
    throw new Error('Failed to fetch teachers');
  }
  return response.json();
}

export default function NewClassPage() {
  const router = useRouter();

  const { data: academicYears, isLoading: loadingYears } = useQuery({
    queryKey: ['academic-years'],
    queryFn: fetchAcademicYears,
  });

  const { data: teachers, isLoading: loadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
  });

  const isLoading = loadingYears || loadingTeachers;

  const handleSuccess = () => {
    router.push('/classes');
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/classes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Class</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ClassForm
              academicYears={academicYears || []}
              teachers={teachers || []}
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
