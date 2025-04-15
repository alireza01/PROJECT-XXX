"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // Assuming correct path
import { Search, Plus, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteBook } from "./actions" // Assuming actions.ts is in the same directory
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Book } from "./page"; // Use 'import type' for type-only imports

// Define props for the client component
interface BooksTableClientProps {
  initialBooks: Book[];
}

export default function BooksTableClient({ initialBooks }: BooksTableClientProps) {
  const router = useRouter();
  // Initialize state with the server-fetched books
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false); // For delete operation
  const [error, setError] = useState<string | null>(null); // For delete operation

  // Filter logic remains the same, but operates on the 'books' state
  const filteredBooks = books.filter((book) => {
    const titleMatch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const authorMatch = book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchesSearch = titleMatch || authorMatch;
    const matchesLevel = selectedLevel === "all" || book.level === selectedLevel;
    const matchesLanguage = selectedLanguage === "all" || book.language === selectedLanguage;
    return matchesSearch && matchesLevel && matchesLanguage;
  });

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Ensure deleteBook returns a consistent object shape
      const result: { success: boolean; error?: string } = await deleteBook(id);
      if (result.success) {
        // Update the local state to remove the deleted book
        setBooks(currentBooks => currentBooks.filter(book => book.id !== id));
        // Optionally show a success toast/message
        router.refresh(); // Still useful to ensure consistency if other users might be making changes
      } else {
        setError(result.error || "Failed to delete book.");
        // Optionally show an error toast/message
      }
    } catch (err: any) { // Catch specific error types if possible
        setError(err.message || "An unexpected error occurred during deletion.");
        console.error("Delete error:", err);
    } finally {
        setIsLoading(false);
    }
  };

  // Helper to format date safely
  const formatDate = (dateInput: string | Date | undefined | null): string => {
    if (!dateInput) return 'N/A';
    try {
      return new Date(dateInput).toLocaleDateString("fa-IR", { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Invalid Date:", dateInput, e);
      return 'Invalid Date';
    }
  };

  // Helper to get level display name
  const getLevelDisplay = (level: string | undefined | null): string => {
    switch (level) {
      case 'beginner': return 'مقدماتی';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'پیشرفته';
      default: return 'نامشخص';
    }
  };

   // Helper to get language display name
   const getLanguageDisplay = (language: string | undefined | null): string => {
    switch (language) {
      case 'persian': return 'فارسی';
      case 'english': return 'انگلیسی';
      default: return 'نامشخص';
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Optional: Display delete error */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>لیست کتاب‌ها</CardTitle>
            <div className="text-sm text-muted-foreground pt-1">مدیریت کتاب‌های موجود در سیستم</div>
          </div>
           <Link href="/admin-secure-dashboard-xyz123/books/new">
             <Button>
               <Plus className="mr-2 h-4 w-4" /> افزودن کتاب جدید
             </Button>
           </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Filter and Search Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجو در عنوان و نویسنده..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full" // Ensure padding for icon
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 {/* Using Shadcn Select component would be better here if available */}
                 <select
                   value={selectedLevel}
                   onChange={(e) => setSelectedLevel(e.target.value)}
                   className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 >
                   <option value="all">همه سطوح</option>
                   <option value="beginner">مقدماتی</option>
                   <option value="intermediate">متوسط</option>
                   <option value="advanced">پیشرفته</option>
                 </select>
                 <select
                   value={selectedLanguage}
                   onChange={(e) => setSelectedLanguage(e.target.value)}
                   className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 >
                   <option value="all">همه زبان‌ها</option>
                   <option value="persian">فارسی</option>
                   <option value="english">انگلیسی</option>
                 </select>
              </div>
            </div>

            {/* Books Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان</TableHead>
                    <TableHead>نویسنده</TableHead>
                    <TableHead>سطح</TableHead>
                    <TableHead>زبان</TableHead>
                    <TableHead>صفحات</TableHead>
                    <TableHead>تاریخ ایجاد</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title ?? 'بدون عنوان'}</TableCell>
                        <TableCell>{book.author ?? 'ناشناس'}</TableCell>
                        <TableCell>
                          <Badge>{getLevelDisplay(book.level)}</Badge>
                        </TableCell>
                        <TableCell>
                           <Badge>{getLanguageDisplay(book.language)}</Badge>
                        </TableCell>
                        <TableCell>{book.pages ?? '-'}</TableCell>
                        <TableCell>{formatDate(book.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={isLoading}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin-secure-dashboard-xyz123/books/${book.id}`}>
                                  <Eye className="ml-2 h-4 w-4" />
                                  مشاهده
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin-secure-dashboard-xyz123/books/edit/${book.id}`}>
                                  <Pencil className="ml-2 h-4 w-4" />
                                  ویرایش
                                </Link>
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  {/* Prevent default selection behavior which closes the dropdown */}
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer" // Added cursor-pointer
                                    disabled={isLoading}
                                  >
                                    <Trash className="ml-2 h-4 w-4" />
                                    {isLoading ? 'در حال حذف...' : 'حذف'}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      این عمل قابل بازگشت نیست. کتاب "{book.title ?? 'بدون عنوان'}" به طور کامل از سیستم حذف خواهد شد.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isLoading}>انصراف</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(book.id)}
                                      disabled={isLoading}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isLoading ? 'در حال حذف...' : 'تایید حذف'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        هیچ کتابی یافت نشد.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}