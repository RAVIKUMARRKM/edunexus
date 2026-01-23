'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, CheckCircle } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNo: string;
  admissionNo: string;
}

interface GradeEntryProps {
  examId: string;
  subjects: Subject[];
  maxMarks: number;
  passingMarks: number;
}

interface StudentGrade {
  studentId: string;
  marksObtained: number | string;
  isAbsent: boolean;
  remarks: string;
}

export default function GradeEntry({
  examId,
  subjects,
  maxMarks,
  passingMarks,
}: GradeEntryProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Record<string, StudentGrade>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudentsAndResults();
    }
  }, [selectedSubject]);

  const fetchStudentsAndResults = async () => {
    setLoading(true);
    try {
      // Fetch students from the class
      const studentsResponse = await fetch(
        `/api/exams/${examId}/students`
      );

      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
      }

      // Fetch existing results for this subject
      const resultsResponse = await fetch(
        `/api/exams/${examId}/results?subjectId=${selectedSubject}`
      );

      if (resultsResponse.ok) {
        const results = await resultsResponse.json();
        const gradesMap: Record<string, StudentGrade> = {};

        results.forEach((result: any) => {
          gradesMap[result.studentId] = {
            studentId: result.studentId,
            marksObtained: result.isAbsent ? '' : parseFloat(result.marksObtained),
            isAbsent: result.isAbsent,
            remarks: result.remarks || '',
          };
        });

        setGrades(gradesMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId: string, value: string) => {
    const numValue = value === '' ? '' : parseFloat(value);

    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        marksObtained: numValue,
        isAbsent: false,
      },
    }));
  };

  const handleAbsentToggle = (studentId: string, isAbsent: boolean) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        marksObtained: isAbsent ? '' : 0,
        isAbsent,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        remarks: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }

    const results = Object.values(grades).map((grade) => ({
      studentId: grade.studentId,
      subjectId: selectedSubject,
      marksObtained: grade.isAbsent ? 0 : grade.marksObtained,
      isAbsent: grade.isAbsent,
      remarks: grade.remarks,
    }));

    // Validate marks
    for (const result of results) {
      if (!result.isAbsent) {
        const marks = parseFloat(result.marksObtained.toString());
        if (isNaN(marks) || marks < 0 || marks > maxMarks) {
          alert(`Invalid marks for a student. Marks must be between 0 and ${maxMarks}`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/exams/${examId}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results }),
      });

      if (response.ok) {
        alert('Grades saved successfully!');
        fetchStudentsAndResults();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save grades');
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  const calculateGrade = (marks: number): string => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= passingMarks) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-xs">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSubject && students.length > 0 && (
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Grades'}
          </Button>
        )}
      </div>

      {selectedSubject && (
        <>
          {loading ? (
            <div className="text-center py-12">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No students found for this class
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-32">Marks (Max: {maxMarks})</TableHead>
                    <TableHead className="w-20">Absent</TableHead>
                    <TableHead className="w-20">Grade</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const grade = grades[student.id] || {
                      studentId: student.id,
                      marksObtained: '',
                      isAbsent: false,
                      remarks: '',
                    };
                    const marks = typeof grade.marksObtained === 'number'
                      ? grade.marksObtained
                      : parseFloat(grade.marksObtained as string) || 0;
                    const calculatedGrade = grade.isAbsent ? 'AB' : calculateGrade(marks);
                    const isPassed = !grade.isAbsent && marks >= passingMarks;

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.rollNo}
                        </TableCell>
                        <TableCell>
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={maxMarks}
                            value={grade.marksObtained}
                            onChange={(e) =>
                              handleMarksChange(student.id, e.target.value)
                            }
                            disabled={grade.isAbsent}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={grade.isAbsent}
                            onChange={(e) =>
                              handleAbsentToggle(student.id, e.target.checked)
                            }
                            className="h-4 w-4"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              calculatedGrade === 'AB'
                                ? 'outline'
                                : isPassed
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {calculatedGrade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {grade.isAbsent ? (
                            <Badge variant="outline">Absent</Badge>
                          ) : isPassed ? (
                            <Badge className="bg-green-500">Pass</Badge>
                          ) : (
                            <Badge variant="destructive">Fail</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={grade.remarks}
                            onChange={(e) =>
                              handleRemarksChange(student.id, e.target.value)
                            }
                            placeholder="Optional"
                            className="w-40"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {!selectedSubject && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Please select a subject to enter grades
          </p>
        </div>
      )}
    </div>
  );
}
