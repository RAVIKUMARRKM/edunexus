'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Calendar,
  Edit,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import ExamScheduleForm from '@/components/exams/ExamScheduleForm';

interface ExamDetails {
  id: string;
  name: string;
  examType: string;
  startDate: string;
  endDate: string;
  maxMarks: number;
  passingMarks: number;
  isPublished: boolean;
  academicYear: {
    name: string;
  };
  class: {
    name: string;
    numericValue: number;
    subjects: Array<{
      id: string;
      name: string;
      code: string;
      type: string;
    }>;
  };
  schedules: Array<{
    id: string;
    subjectId: string;
    date: string;
    startTime: string;
    endTime: string;
    roomNo: string | null;
  }>;
  _count: {
    results: number;
    schedules: number;
  };
}

export default function ExamDetailPage({ params }: { params: { id: string } }) {
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      const response = await fetch(`/api/exams/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/exams');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam');
    }
  };

  const handlePublishToggle = async () => {
    if (!exam) return;

    try {
      const response = await fetch(`/api/exams/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !exam.isPublished,
        }),
      });

      if (response.ok) {
        fetchExam();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update exam');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Failed to update exam');
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
      <div className="flex justify-between items-center">
        <div>
          <Link href="/exams">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{exam.name}</h1>
          <p className="text-muted-foreground">
            {exam.class.name} - {exam.academicYear.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={exam.isPublished ? 'outline' : 'default'}
            onClick={handlePublishToggle}
          >
            {exam.isPublished ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Exam Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{exam.examType.replace('_', ' ')}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {format(new Date(exam.startDate), 'MMM dd')} -{' '}
              {format(new Date(exam.endDate), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Max: {exam.maxMarks} | Passing: {exam.passingMarks}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {exam.isPublished ? (
              <Badge variant="outline" className="bg-green-50">
                Published
              </Badge>
            ) : (
              <Badge variant="outline">Draft</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule ({exam._count.schedules})
          </TabsTrigger>
          <TabsTrigger value="grades">
            <Edit className="mr-2 h-4 w-4" />
            Grade Entry
          </TabsTrigger>
          <TabsTrigger value="results">
            <FileText className="mr-2 h-4 w-4" />
            Results ({exam._count.results})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Schedule</CardTitle>
              <CardDescription>
                Create and manage exam schedules for each subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExamScheduleForm
                examId={exam.id}
                subjects={exam.class.subjects}
                existingSchedules={exam.schedules}
                onScheduleCreated={fetchExam}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Grade Entry</CardTitle>
              <CardDescription>
                Enter marks for students in this exam
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Link href={`/exams/${exam.id}/grades`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Go to Grade Entry
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
              <CardDescription>
                View all results for this exam
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Link href={`/exams/${exam.id}/results`}>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  View All Results
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
