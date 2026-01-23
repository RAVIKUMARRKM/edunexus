import { BookForm } from '@/components/library/BookForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
        <p className="text-muted-foreground">
          Add a new book to the library catalog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm />
        </CardContent>
      </Card>
    </div>
  );
}
