import { BookEditor } from '@/components/BookEditor';
import { BookUpload } from '@/components/BookUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload a New Book</h1>
      
      <Tabs defaultValue="text" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Editor</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <BookEditor onUploadComplete={(bookId) => {
            console.log('Book uploaded with ID:', bookId);
          }} />
        </TabsContent>
        
        <TabsContent value="file">
          <BookUpload onUploadComplete={(bookId) => {
            console.log('Book uploaded with ID:', bookId);
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 