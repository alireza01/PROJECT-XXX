"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteBook } from "./actions"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Book {
  id: string
  title: string
  author: string
  level: string
  language: string
  pages: number
  description: string
  coverUrl: string
  createdAt: Date
  updatedAt: Date
}

export default function BooksPage({ books }: { books: Book[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "all" || book.level === selectedLevel
    const matchesLanguage = selectedLanguage === "all" || book.language === selectedLanguage
    return matchesSearch && matchesLevel && matchesLanguage
  })

  const handleDelete = async (id: string) => {
    const result = await deleteBook(id)
    if (result.success) {
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>مدیریت کتاب‌ها</CardTitle>
              <CardDescription>لیست تمام کتاب‌های موجود در سیستم</CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin-secure-dashboard-xyz123/books/new">
                <Plus className="h-4 w-4 ml-2" />
                افزودن کتاب جدید
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجو در عنوان و نویسنده..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="all">همه سطوح</option>
                  <option value="beginner">مقدماتی</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">پیشرفته</option>
                </select>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="all">همه زبان‌ها</option>
                  <option value="persian">فارسی</option>
                  <option value="english">انگلیسی</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان</TableHead>
                    <TableHead>نویسنده</TableHead>
                    <TableHead>سطح</TableHead>
                    <TableHead>زبان</TableHead>
                    <TableHead>تعداد صفحات</TableHead>
                    <TableHead>تاریخ ایجاد</TableHead>
                    <TableHead>عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {book.level === "beginner" && "مقدماتی"}
                          {book.level === "intermediate" && "متوسط"}
                          {book.level === "advanced" && "پیشرفته"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {book.language === "persian" && "فارسی"}
                          {book.language === "english" && "انگلیسی"}
                        </Badge>
                      </TableCell>
                      <TableCell>{book.pages}</TableCell>
                      <TableCell>
                        {new Date(book.createdAt).toLocaleDateString("fa-IR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin-secure-dashboard-xyz123/books/${book.id}`}>
                                <Eye className="h-4 w-4 ml-2" />
                                مشاهده
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin-secure-dashboard-xyz123/books/edit/${book.id}`}>
                                <Pencil className="h-4 w-4 ml-2" />
                                ویرایش
                              </Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash className="h-4 w-4 ml-2" />
                                  حذف
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    این عمل قابل بازگشت نیست. کتاب به طور کامل از سیستم حذف خواهد شد.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(book.id)}>
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
