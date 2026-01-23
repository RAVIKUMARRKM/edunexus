'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface ReportCardData {
  exam: {
    id: string;
    name: string;
    examType: string;
    academicYear: string;
    class: string;
    maxMarks: number;
    passingMarks: number;
  };
  student: {
    id: string;
    name: string;
    admissionNo: string;
    rollNo: string;
    class: string | null;
    section: string | null;
    dateOfBirth: string;
    photo: string | null;
  };
  results: {
    subjects: Array<{
      subjectName: string;
      subjectCode: string;
      subjectType: string;
      maxMarks: number;
      marksObtained: number | string;
      grade: string;
      percentage: number | string;
      isPassed: boolean;
      isAbsent: boolean;
      remarks: string | null;
    }>;
    summary: {
      totalMarksObtained: number;
      totalMaxMarks: number;
      subjectCount: number;
      percentage: string;
      grade: string;
      result: string;
      failedSubjects: number;
      rank: number;
      totalStudents: number;
    };
  };
  generatedAt: string;
}

interface ReportCardProps {
  data: ReportCardData;
}

export default function ReportCard({ data }: ReportCardProps) {
  const { exam, student, results } = data;

  return (
    <div className="bg-white print:p-8 p-6 rounded-lg border print:border-0 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          EduNexus School
        </h1>
        <p className="text-gray-600">Excellence in Education</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          REPORT CARD
        </h2>
        <p className="text-gray-600 mt-2">
          {exam.name} - {exam.academicYear}
        </p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-40">Student Name:</span>
            <span>{student.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Admission No:</span>
            <span>{student.admissionNo}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Roll No:</span>
            <span>{student.rollNo}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex">
            <span className="font-semibold w-40">Class:</span>
            <span>
              {student.class} {student.section && `- ${student.section}`}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Date of Birth:</span>
            <span>{format(new Date(student.dateOfBirth), 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-40">Exam Type:</span>
            <span>{exam.examType.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Academic Performance</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center w-32">Max Marks</TableHead>
                <TableHead className="text-center w-32">Marks Obtained</TableHead>
                <TableHead className="text-center w-24">Percentage</TableHead>
                <TableHead className="text-center w-20">Grade</TableHead>
                <TableHead className="text-center w-24">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.subjects.map((subject, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{subject.subjectName}</p>
                      <p className="text-sm text-gray-500">
                        {subject.subjectCode}
                        {subject.subjectType !== 'THEORY' && ` (${subject.subjectType})`}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{subject.maxMarks}</TableCell>
                  <TableCell className="text-center font-semibold">
                    {subject.marksObtained}
                  </TableCell>
                  <TableCell className="text-center">
                    {subject.percentage}
                    {subject.percentage !== 'AB' && '%'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        subject.isAbsent
                          ? 'outline'
                          : subject.isPassed
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {subject.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {subject.isAbsent ? (
                      <Badge variant="outline">Absent</Badge>
                    ) : subject.isPassed ? (
                      <Badge className="bg-green-500">Pass</Badge>
                    ) : (
                      <Badge variant="destructive">Fail</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell colSpan={2} className="text-right">
                  TOTAL
                </TableCell>
                <TableCell className="text-center">
                  {results.summary.totalMaxMarks}
                </TableCell>
                <TableCell className="text-center">
                  {results.summary.totalMarksObtained.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {results.summary.percentage}%
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      results.summary.result === 'PASS' ? 'default' : 'destructive'
                    }
                  >
                    {results.summary.grade}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      results.summary.result === 'PASS'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }
                  >
                    {results.summary.result}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Subjects:</span>
            <span className="font-semibold">{results.summary.subjectCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Failed Subjects:</span>
            <span
              className={`font-semibold ${
                results.summary.failedSubjects > 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {results.summary.failedSubjects}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Overall Percentage:</span>
            <span className="font-semibold">{results.summary.percentage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Overall Grade:</span>
            <span className="font-semibold text-lg">
              {results.summary.grade}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-4">Class Standing</h3>
          <div className="flex justify-between">
            <span className="text-gray-600">Class Rank:</span>
            <span className="font-semibold">
              {results.summary.rank} / {results.summary.totalStudents}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Final Result:</span>
            <span
              className={`font-semibold text-lg ${
                results.summary.result === 'PASS'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {results.summary.result}
            </span>
          </div>
        </div>
      </div>

      {/* Grade Scale */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold mb-3">Grading Scale</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge>A+</Badge>
            <span className="text-gray-600">90-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>A</Badge>
            <span className="text-gray-600">80-89%</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>B+</Badge>
            <span className="text-gray-600">70-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>B</Badge>
            <span className="text-gray-600">60-69%</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>C</Badge>
            <span className="text-gray-600">50-59%</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">F</Badge>
            <span className="text-gray-600">Below {exam.passingMarks}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end pt-8 border-t">
        <div>
          <div className="border-t border-gray-400 pt-2 w-48">
            <p className="text-sm text-gray-600">Class Teacher</p>
          </div>
        </div>
        <div>
          <div className="border-t border-gray-400 pt-2 w-48">
            <p className="text-sm text-gray-600">Principal</p>
          </div>
        </div>
      </div>

      {/* Generated Date */}
      <div className="text-center mt-6 text-xs text-gray-500 print:hidden">
        Generated on {format(new Date(data.generatedAt), 'dd/MM/yyyy hh:mm a')}
      </div>
    </div>
  );
}
