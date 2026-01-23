'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, FileText, Search } from 'lucide-react';
import Link from 'next/link';

interface Result {
  id: string;
  marksObtained: string;
  grade: string;
  isAbsent: boolean;
  remarks: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNo: string;
    admissionNo: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  exam: {
    name: string;
    maxMarks: number;
    passingMarks: number;
  };
}

interface ResultsTableProps {
  examId: string;
  maxMarks: number;
  passingMarks: number;
}

export default function ResultsTable({
  examId,
  maxMarks,
  passingMarks,
}: ResultsTableProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchResults();
  }, [examId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exams/${examId}/results`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique subjects from results
  const subjects = Array.from(
    new Set(results.map((r) => r.subject.id))
  ).map((id) => {
    const result = results.find((r) => r.subject.id === id);
    return result ? { id, name: result.subject.name, code: result.subject.code } : null;
  }).filter((s): s is { id: string; name: string; code: string } => s !== null);

  // Group results by student
  const studentResults = results.reduce((acc, result) => {
    const studentId = result.student.id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student: result.student,
        subjects: [],
        totalMarks: 0,
        totalMaxMarks: 0,
        failedCount: 0,
      };
    }

    const marks = result.isAbsent ? 0 : parseFloat(result.marksObtained);
    acc[studentId].subjects.push({
      ...result,
      marksObtained: marks,
    });

    if (!result.isAbsent) {
      acc[studentId].totalMarks += marks;
      acc[studentId].totalMaxMarks += maxMarks;

      if (marks < passingMarks) {
        acc[studentId].failedCount++;
      }
    }

    return acc;
  }, {} as Record<string, any>);

  const studentsArray = Object.values(studentResults);

  // Filter results
  const filteredStudents = studentsArray.filter((student: any) => {
    const matchesSearch =
      student.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      subjectFilter === 'all' ||
      student.subjects.some((s: any) => s.subject.id === subjectFilter);

    const isPassed = student.failedCount === 0;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pass' && isPassed) ||
      (statusFilter === 'fail' && !isPassed);

    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Calculate statistics
  const totalStudents = studentsArray.length;
  const passedStudents = studentsArray.filter((s: any) => s.failedCount === 0).length;
  const failedStudents = totalStudents - passedStudents;
  const passPercentage = totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0;

  if (loading) {
    return <div className="text-center py-12">Loading results...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No results found for this exam</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Passed</p>
          <p className="text-2xl font-bold text-green-600">{passedStudents}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Failed</p>
          <p className="text-2xl font-bold text-red-600">{failedStudents}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Pass %</p>
          <p className="text-2xl font-bold text-purple-600">
            {passPercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pass">Passed</SelectItem>
            <SelectItem value="fail">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Results Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Roll</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead className="w-32">Total Marks</TableHead>
              <TableHead className="w-24">Percentage</TableHead>
              <TableHead className="w-20">Grade</TableHead>
              <TableHead className="w-24">Result</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((studentData: any) => {
              const percentage =
                studentData.totalMaxMarks > 0
                  ? (studentData.totalMarks / studentData.totalMaxMarks) * 100
                  : 0;
              const isPassed = studentData.failedCount === 0;

              // Calculate overall grade
              let overallGrade = 'F';
              if (percentage >= 90) overallGrade = 'A+';
              else if (percentage >= 80) overallGrade = 'A';
              else if (percentage >= 70) overallGrade = 'B+';
              else if (percentage >= 60) overallGrade = 'B';
              else if (percentage >= 50) overallGrade = 'C';
              else if (percentage >= passingMarks) overallGrade = 'D';

              return (
                <TableRow key={studentData.student.id}>
                  <TableCell className="font-medium">
                    {studentData.student.rollNo}
                  </TableCell>
                  <TableCell>
                    {studentData.student.firstName} {studentData.student.lastName}
                  </TableCell>
                  <TableCell>
                    {studentData.totalMarks.toFixed(2)} / {studentData.totalMaxMarks}
                  </TableCell>
                  <TableCell>{percentage.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={isPassed ? 'default' : 'destructive'}
                    >
                      {overallGrade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isPassed ? (
                      <Badge className="bg-green-500">Pass</Badge>
                    ) : (
                      <Badge variant="destructive">Fail</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/exams/${examId}/report-card/${studentData.student.id}`}
                    >
                      <Button variant="ghost" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Report Card
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results match your filters
          </p>
        </div>
      )}
    </div>
  );
}
