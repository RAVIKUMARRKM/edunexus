'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Plus, Calendar, Tag, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: string;
  attachmentUrl?: string;
  publishedAt: string;
  expiresAt?: string;
  createdAt: string;
}

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchNotices();
  }, [filter]);

  const fetchNotices = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      const url = filter !== 'all'
        ? `/api/notices?type=${filter}&t=${Date.now()}` // Add timestamp to bypass cache
        : `/api/notices?t=${Date.now()}`;

      const response = await fetch(url, {
        cache: 'no-store', // Ensure fresh data
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(data.notices || []);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchNotices(true);
    router.refresh(); // Refresh router cache as well
  };

  const getNoticeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      GENERAL: 'default',
      ACADEMIC: 'info',
      EXAM: 'warning',
      EVENT: 'success',
      HOLIDAY: 'success',
      EMERGENCY: 'destructive',
      FEE_REMINDER: 'warning',
    };
    return colors[type] || 'default';
  };

  const getNoticeTypeLabel = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-600 mt-1">
            View all school notices and announcements
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/communication/notices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'GENERAL', 'ACADEMIC', 'EXAM', 'EVENT', 'HOLIDAY', 'EMERGENCY'].map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type === 'all' ? 'All Notices' : getNoticeTypeLabel(type)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                        <Badge variant={getNoticeTypeColor(notice.type) as any}>
                          {getNoticeTypeLabel(notice.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(notice.publishedAt).toLocaleDateString()}
                        </span>
                        {notice.expiresAt && (
                          <span className="text-orange-600">
                            Expires: {new Date(notice.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {notice.content}
                </p>
                {notice.attachmentUrl && (
                  <a
                    href={notice.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Attachment
                  </a>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notices found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new notice to get started
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
