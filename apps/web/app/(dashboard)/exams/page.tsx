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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Calendar, FileText, Users, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Exam {
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
    isCurrent: boolean;
  };
  class: {
    name: string;
    numericValue: number;
  };
  _count: {
    results: number;
    schedules: number;
  };
}

const examTypeColors: Record<string, string> = {
  UNIT_TEST: 'bg-blue-500',
  MID_TERM: 'bg-yellow-500',
  FINAL: 'bg-red-500',
  PRACTICAL: 'bg-green-500',
  ASSIGNMENT: 'bg-purple-500',
};

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  useEffect(() => {
    fetchExams();
  }, [academicYearFilter, classFilter, examTypeFilter, publishedFilter]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (academicYearFilter !== 'all') params.append('academicYearId', academicYearFilter);
      if (classFilter !== 'all') params.append('classId', classFilter);
      if (examTypeFilter !== 'all') params.append('examType', examTypeFilter);
      if (publishedFilter !== 'all') params.append('isPublished', publishedFilter);

      const response = await fetch(`/api/exams?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
          <p className="text-muted-foreground">
            Manage exams, schedules, and grade entry
          </p>
        </div>
        <Link href="/exams/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Academic Year
              </label>
              <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {/* Add academic years dynamically */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {/* Add classes dynamically */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Exam Type
              </label>
              <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="UNIT_TEST">Unit Test</SelectItem>
                  <SelectItem value="MID_TERM">Mid Term</SelectItem>
                  <SelectItem value="FINAL">Final</SelectItem>
                  <SelectItem value="PRACTICAL">Practical</SelectItem>
                  <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={publishedFilter} onValueChange={setPublishedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : exams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No exams found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first exam
            </p>
            <Link href="/exams/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Exam
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/exams/${exam.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{exam.name}</CardTitle>
                    <CardDescription>
                      {exam.class.name} - {exam.academicYear.name}
                    </CardDescription>
                  </div>
                  <Badge
                    className={examTypeColors[exam.examType] || 'bg-gray-500'}
                  >
                    {exam.examType.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(exam.startDate), 'MMM dd')} -{' '}
                    {format(new Date(exam.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Max Marks</p>
                    <p className="font-semibold">{exam.maxMarks}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Passing Marks</p>
                    <p className="font-semibold">{exam.passingMarks}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{exam._count.schedules} schedules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{exam._count.results} results</span>
                    </div>
                  </div>
                  {exam.isPublished ? (
                    <Badge variant="outline" className="bg-green-50">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
