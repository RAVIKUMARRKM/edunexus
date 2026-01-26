'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Search, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface Parent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  _count?: {
    children: number;
  };
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await fetch('/api/parents');
      if (response.ok) {
        const data = await response.json();
        setParents(data.parents || []);
      } else {
        toast.error('Failed to fetch parents');
      }
    } catch (error) {
      console.error('Failed to fetch parents:', error);
      toast.error('Failed to fetch parents');
    } finally {
      setLoading(false);
    }
  };

  const filteredParents = parents.filter((parent) =>
    parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (parent.phone && parent.phone.includes(searchQuery))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parents</h1>
          <p className="text-gray-600 mt-1">
            Manage parent accounts and communication
          </p>
        </div>
        <Link href="/parents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Parent
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Parents</p>
                <p className="text-2xl font-bold">{parents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParents.length > 0 ? (
          filteredParents.map((parent) => (
            <Card key={parent.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={parent.avatar} />
                    <AvatarFallback>
                      {parent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {parent.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        PARENT
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        <span className="truncate">{parent.email}</span>
                      </div>
                      {parent.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{parent.phone}</span>
                        </div>
                      )}
                      {parent._count && parent._count.children > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-3 w-3 mr-1" />
                          <span>{parent._count.children} child{parent._count.children > 1 ? 'ren' : ''}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link href={`/parents/${parent.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View
                        </Button>
                      </Link>
                      <Link href={`/communication/messages/compose?userId=${parent.id}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">
                          <Mail className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No parents found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {searchQuery
                    ? 'Try a different search query'
                    : 'Create a parent account to get started'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
