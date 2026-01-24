'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function AttendanceTrendsPage() {
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      if (selectedClass) params.append('classId', selectedClass);

      const res = await fetch(`/api/attendance/trends?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTrendsData(data);
      } else {
        toast.error('Failed to load trends');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Trends</h1>
        <p className="text-muted-foreground">
          Visualize attendance patterns and trends over time
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date Range & Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Class (Optional)</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-end">
              <Button onClick={fetchTrends} className="w-full" disabled={loading}>
                {loading ? 'Loading...' : 'Load Trends'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {trendsData && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trendsData.summary?.averageAttendance || '0'}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Over {trendsData.summary?.totalDays || 0} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Highest Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {trendsData.summary?.highestAttendance || '0'}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {trendsData.summary?.highestDate &&
                    format(new Date(trendsData.summary.highestDate), 'PPP')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Lowest Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {trendsData.summary?.lowestAttendance || '0'}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {trendsData.summary?.lowestDate &&
                    format(new Date(trendsData.summary.lowestDate), 'PPP')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {trendsData.summary?.trend > 0 ? '+' : ''}
                    {trendsData.summary?.trend || '0'}%
                  </div>
                  {trendsData.summary?.trend > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs previous period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Attendance Pattern
              </CardTitle>
              <CardDescription>Attendance percentage by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trendsData.daily && trendsData.daily.length > 0 ? (
                  trendsData.daily.map((day: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-muted-foreground">
                        {format(new Date(day.date), 'MMM dd')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className={cn(
                                'h-full transition-all',
                                getPercentageColor(day.attendancePercentage)
                              )}
                              style={{ width: `${day.attendancePercentage}%` }}
                            />
                          </div>
                          <div className="w-16 text-right font-medium text-sm">
                            {day.attendancePercentage}%
                          </div>
                        </div>
                      </div>
                      <div className="w-24 text-sm text-muted-foreground text-right">
                        {day.present}/{day.total}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance data for selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Attendance Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Present</div>
                  <div className="text-2xl font-bold text-green-600">
                    {trendsData.distribution?.present || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trendsData.distribution?.presentPercent || 0}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Absent</div>
                  <div className="text-2xl font-bold text-red-600">
                    {trendsData.distribution?.absent || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trendsData.distribution?.absentPercent || 0}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Late</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {trendsData.distribution?.late || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trendsData.distribution?.latePercent || 0}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Half Day</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {trendsData.distribution?.halfDay || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trendsData.distribution?.halfDayPercent || 0}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Leave</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {trendsData.distribution?.leave || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trendsData.distribution?.leavePercent || 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
