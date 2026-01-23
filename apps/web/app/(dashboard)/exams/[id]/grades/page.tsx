'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GradeEntry from '@/components/exams/GradeEntry';

interface ExamDetails {
  id: string;
  name: string;
  maxMarks: number;
  passingMarks: number;
  class: {
    name: string;
    subjects: Array<{
      id: string;
      name: string;
      code: string;
    }>;
  };
}

export default function GradeEntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [params.id]);

  const fetchExam = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exams/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data);
      } else {
        router.push('/exams');
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  if (!exam) {
    return <div className="container mx-auto py-6">Exam not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Link href={`/exams/${exam.id}`}>
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exam
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Grade Entry</h1>
        <p className="text-muted-foreground">
          {exam.name} - {exam.class.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Marks for Students</CardTitle>
        </CardHeader>
        <CardContent>
          <GradeEntry
            examId={exam.id}
            subjects={exam.class.subjects}
            maxMarks={exam.maxMarks}
            passingMarks={exam.passingMarks}
          />
        </CardContent>
      </Card>
    </div>
  );
}
