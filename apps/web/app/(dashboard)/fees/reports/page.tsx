'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FeeReport } from '@/components/fees/FeeReport';
import { toast } from 'sonner';
import { Download, RefreshCw } from 'lucide-react';

export default function FeeReportsPage() {
  const [reportType, setReportType] = useState('collection-summary');
  const [reportData, setReportData] = useState<any>(null);
  const [defaultersData, setDefaultersData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [classId, setClassId] = useState('');

  const generateReport = async () => {
    setIsLoading(true);
    try {
      let url = `/api/fees/reports?type=${reportType}`;
      if (fromDate) url += `&fromDate=${fromDate}`;
      if (toDate) url += `&toDate=${toDate}`;
      if (classId) url += `&classId=${classId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json();
      setReportData(data);
      toast.success('Report generated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultersReport = async () => {
    setIsLoading(true);
    try {
      let url = `/api/fees/reports?type=defaulters`;
      if (classId) url += `&classId=${classId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to generate defaulters report');
      const data = await response.json();
      setDefaultersData(data);
      toast.success('Defaulters report generated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate defaulters report');
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    toast.info('Export feature coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Fee Reports</h1>
        <p className="text-gray-500 mt-1">
          Generate and view various fee collection reports
        </p>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="collection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collection">Collection Reports</TabsTrigger>
          <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
        </TabsList>

        {/* Collection Reports */}
        <TabsContent value="collection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collection-summary">
                          Collection Summary
                        </SelectItem>
                        <SelectItem value="payment-mode">
                          Payment Mode Wise
                        </SelectItem>
                        <SelectItem value="class-wise">Class Wise</SelectItem>
                        <SelectItem value="monthly-collection">
                          Monthly Collection
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {reportType !== 'monthly-collection' && (
                    <>
                      <div>
                        <Label htmlFor="fromDate">From Date</Label>
                        <Input
                          id="fromDate"
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="toDate">To Date</Label>
                        <Input
                          id="toDate"
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {reportType === 'class-wise' && (
                    <div>
                      <Label htmlFor="classId">Class (Optional)</Label>
                      <Select value={classId} onValueChange={setClassId}>
                        <SelectTrigger>
                          <SelectValue placeholder="All classes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          <SelectItem value="1">Class 1</SelectItem>
                          <SelectItem value="2">Class 2</SelectItem>
                          <SelectItem value="3">Class 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateReport} disabled={isLoading}>
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                    />
                    {isLoading ? 'Generating...' : 'Generate Report'}
                  </Button>
                  {reportData && (
                    <Button variant="outline" onClick={exportReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Display */}
          {reportData && (
            <FeeReport type={reportType as any} data={reportData} />
          )}
        </TabsContent>

        {/* Defaulters Report */}
        <TabsContent value="defaulters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Defaulters Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaulterClassId">Class (Optional)</Label>
                    <Select value={classId} onValueChange={setClassId}>
                      <SelectTrigger>
                        <SelectValue placeholder="All classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Classes</SelectItem>
                        <SelectItem value="1">Class 1</SelectItem>
                        <SelectItem value="2">Class 2</SelectItem>
                        <SelectItem value="3">Class 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateDefaultersReport} disabled={isLoading}>
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                    />
                    {isLoading ? 'Generating...' : 'Generate Report'}
                  </Button>
                  {defaultersData && (
                    <Button variant="outline" onClick={exportReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Defaulters List */}
          {defaultersData && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Fee Defaulters ({defaultersData.summary?.count || 0})
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Total Due Amount: ₹
                  {defaultersData.summary?.totalDueAmount?.toFixed(2) || 0}
                </p>
              </CardHeader>
              <CardContent>
                {defaultersData.defaulters?.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No defaulters found
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admission No</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Due Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {defaultersData.defaulters?.map((defaulter: any) => (
                        <TableRow key={defaulter.studentId}>
                          <TableCell>{defaulter.admissionNo}</TableCell>
                          <TableCell className="font-medium">
                            {defaulter.name}
                          </TableCell>
                          <TableCell>{defaulter.class || 'N/A'}</TableCell>
                          <TableCell>{defaulter.section || 'N/A'}</TableCell>
                          <TableCell>{defaulter.phone || 'N/A'}</TableCell>
                          <TableCell className="text-right text-red-600 font-semibold">
                            ₹{defaulter.totalDue.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
