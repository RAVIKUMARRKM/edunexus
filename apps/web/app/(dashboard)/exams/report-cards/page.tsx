'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import ReportCard from '@/components/exams/ReportCard';

export default function ReportCardsPage() {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReportCard = async () => {
    if (!selectedExam || !selectedStudent) {
      alert('Please select both exam and student');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/exams/${selectedExam}/report-card/${selectedStudent}`
      );
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to fetch report card');
      }
    } catch (error) {
      console.error('Error fetching report card:', error);
      alert('Failed to fetch report card');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Link href="/exams">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Report Cards</h1>
        <p className="text-muted-foreground">
          Generate and print student report cards
        </p>
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Select Exam and Student</CardTitle>
          <CardDescription>
            Choose an exam and student to generate their report card
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Exam</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add exams dynamically */}
                  <SelectItem value="exam1">Mid Term - Class 10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add students dynamically based on selected exam's class */}
                  <SelectItem value="student1">John Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={fetchReportCard} disabled={loading}>
              <FileText className="mr-2 h-4 w-4" />
              {loading ? 'Generating...' : 'Generate Report Card'}
            </Button>
            {reportData && (
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {reportData && <ReportCard data={reportData} />}

      {!reportData && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Report Card Generated</h3>
            <p className="text-muted-foreground text-center">
              Select an exam and student to generate their report card
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
