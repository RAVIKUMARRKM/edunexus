'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, Eye, Edit, Trash } from 'lucide-react';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    isbn?: string;
    quantity: number;
    availableQty: number;
    coverImage?: string;
  };
  onDelete?: (id: string) => void;
}

export function BookCard({ book, onDelete }: BookCardProps) {
  const isAvailable = book.availableQty > 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
          </div>
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-16 h-20 object-cover rounded ml-2"
            />
          ) : (
            <div className="w-16 h-20 bg-muted rounded ml-2 flex items-center justify-center">
              <Book className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{book.category}</Badge>
          <Badge variant={isAvailable ? 'default' : 'destructive'}>
            {book.availableQty}/{book.quantity} Available
          </Badge>
        </div>

        {book.isbn && (
          <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/library/books/${book.id}`}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/library/books/${book.id}/edit`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(book.id)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
