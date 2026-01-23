'use client';

import { useQuery } from '@tanstack/react-query';
import { ClassCard } from '@/components/classes/ClassCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

async function fetchClasses() {
  const response = await fetch('/api/classes?includeDetails=false');
  if (!response.ok) {
    throw new Error('Failed to fetch classes');
  }
  return response.json();
}

export default function ClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

  const filteredClasses = classes?.filter((classData: any) =>
    classData.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">
            Manage classes, sections, and subjects
          </p>
        </div>
        <Link href="/classes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Class
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-lg" />
          ))}
        </div>
      ) : filteredClasses && filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classData: any) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No classes found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Get started by creating your first class'}
          </p>
          {!searchQuery && (
            <Link href="/classes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Class
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
