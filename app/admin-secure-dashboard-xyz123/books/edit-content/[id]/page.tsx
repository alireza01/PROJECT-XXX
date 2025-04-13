"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  BookOpen,
  AlertTriangle,
  EyeOff,
  Eye,
  Download,
  ArrowDownUp,
  SearchIcon
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

// Types for our data structure
interface Book {
  id: number
  title: string
  author: string
  language: string
  pages: number
  readers: number
  status: 'active' | 'inactive'
  category?: string
}

export default function BooksManagement() {
  // Get router and search params
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State variables
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalBooks, setTotalBooks] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [sortColumn, setSortColumn] = useState<keyof Book>('id')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for books (in a real app, this would come from an API)
  const mockBooks: Book[] = [
    {
      id: 1,
      title: "اتم‌های عادت",
      author: "جیمز کلیر",
      language: "english",
      pages: 320,
      readers: 342,
      status: "active",
      category: "self-improvement"
    },
    {
      id: 2,
      title: "کشتن مرغ مقلد",
      author: "هارپر لی",
      language: "english",
      pages: 281,
      readers: 289,
      status: "active",
      category: "fiction"
    },
    {
      id: 3,
      title: "هری پاتر و سنگ جادو",
      author: "جی.کی. رولینگ",
      language: "english",
      pages: 223,
      readers: 256,
      status: "active",
      category: "fiction"
    },
    { 
      id: 4, 
      title: "1984", 
      author: "جورج اورول", 
      language: "english", 
      pages: 328, 
      readers: 198, 
      status: "active",
      category: "fiction" 
    },
    {
      id: 5,
      title: "شازده کوچولو",
      author: "آنتوان دو سنت اگزوپری",
      language: "french",
      pages: 96,
      readers: 187,
      status: "active",
      category: "fiction"
    },
    {
      id: 6,
      title: "غرور و تعصب",
      author: "جین آستین",
      language: "english",
      pages: 432,
      readers: 165,
      status: "inactive",
      category: "fiction"
    },
    {
      id: 7,
      title: "صد سال تنهایی",
      author: "گابریل گارسیا مارکز",
      language: "spanish",
      pages: 417,
      readers: 142,
      status: "active",
      category: "fiction"
    },
    {
      id: 8,
      title: "جنایت و مکافات",
      author: "فئودور داستایوفسکی",
      language: "russian",
      pages: 671,
      readers: 128,
      status: "active",
      category: "fiction"
    },
    {
      id: 9,
      title: "مثنوی معنوی",
      author: "مولانا جلال‌الدین محمد بلخی",
      language: "persian",
      pages: 736,
      readers: 254,
      status: "active",
      category: "poetry"
    },
    {
      id: 10,
      title: "بوف کور",
      author: "صادق هدایت",
      language: "persian",
      pages: 148,
      readers: 315,
      status: "active",
      category: "fiction"
    },
    {
      id: 11,
      title: "کلیدر",
      author: "محمود دولت‌آبادی",
      language: "persian",
      pages: 2836,
      readers: 87,
      status: "inactive",
      category: "fiction"
    },
    {
      id: 12,
      title: "پدرخوانده",
      author: "ماریو پوزو",
      language: "english",
      pages: 448,
      readers: 176,
      status: "active",
      category: "fiction"
    }
  ]

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)

  // Simulating data fetch on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      // Simulate API delay
      setTimeout(() => {
        setBooks(mockBooks)
        setIsLoading(false)
        setTotalBooks(mockBooks.length)
      }, 500)
    }
    
    fetchBooks()
  }, [])

  // Filter and sort books whenever dependencies change
  useEffect(() => {
    let result = [...books]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.category && book.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter((book) => book.status === selectedStatus)
    }

    // Filter by language
    if (selectedLanguage !== "all") {
      result = result.filter((book) => book.language === selectedLanguage)
    }

    // Sort data
    result.sort((a, b) => {
      const valueA = a[sortColumn]
      const valueB = b[sortColumn]
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA)
      }
      
      // Handle numeric values
      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number) 
        : (valueB as number) - (valueA as number)
    })

    setFilteredBooks(result)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [books, searchQuery, selectedStatus, selectedLanguage, sortColumn, sortDirection])

  // Handle sorting by column
  const handleSort = (column: keyof Book) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Handle book deletion
  const handleDeleteBook = () => {
    if (bookToDelete) {
      // In a real app, this would call an API
      setBooks(books.filter(book => book.id !== bookToDelete.id))
      toast({
        title: "کتاب حذف شد",
        description: `کتاب "${bookToDelete.title}" با موفقیت حذف شد.`,
        variant: "default",
      })
      setDeleteDialogOpen(false)
      setBookToDelete(null)
    }
  }

  // Toggle book status
  const toggleBookStatus = (id: number) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { ...book, status: book.status === 'active' ? 'inactive' : 'active' } 
        : book
    ))
    
    toast({
      title: "وضعیت کتاب تغییر کرد",
      description: "وضعیت کتاب با موفقیت به‌روزرسانی شد.",
      variant: "default",
    })
  }

  // Extract unique languages for filter dropdown
  const uniqueLanguages = Array.from(new Set(books.map(book => book.language)))

  // Handle changes to the current page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Handle search with debounce
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }
    router.replace(`/admin-secure-dashboard-xyz123/books?${params.toString()}`)
  }

  // Generate page numbers for pagination
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-800 dark:text-amber-300">مدیریت کتاب‌ها</h1>
          <p className="text-amber-700/80 dark:text-amber-400/80">
            مدیریت، افزودن و ویرایش کتاب‌های موجود در سیستم
          </p>
        </div>
        <Button 
          className="bg-amber-600 hover:bg-amber-700 text-white"
          asChild
        >
          <Link href="/admin-secure-dashboard-xyz123/books/add">
            <Plus className="ml-2 h-4 w-4" />
            افزودن کتاب جدید
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="جستجو بر اساس عنوان، نویسنده یا دسته‌بندی..."
            className="pl-3 pr-10"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showFilters ? "default" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
          >
            <Filter className="ml-2 h-4 w-4" />
            فیلترها
            {(selectedStatus !== "all" || selectedLanguage !== "all") && (
              <Badge variant="secondary" className="mr-2">
                {(selectedStatus !== "all" ? 1 : 0) + (selectedLanguage !== "all" ? 1 : 0)}
              </Badge>
            )}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  size="icon"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>دانلود فهرست کتاب‌ها</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-lg">
          <div className="min-w-[200px]">
            <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-300">وضعیت</p>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[200px]">
            <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-300">زبان</p>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب زبان" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">همه</SelectItem>
                  {uniqueLanguages.map(language => (
                    <SelectItem key={language} value={language}>
                      {language === "english" && "انگلیسی"}
                      {language === "persian" && "فارسی"}
                      {language === "french" && "فرانسوی"}
                      {language === "spanish" && "اسپانیایی"}
                      {language === "russian" && "روسی"}
                      {language !== "english" && 
                       language !== "persian" && 
                       language !== "french" && 
                       language !== "spanish" && 
                       language !== "russian" && language}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-amber-100 dark:border-amber-800/40">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
              <p className="mt-2 text-amber-700 dark:text-amber-400">در حال بارگذاری کتاب‌ها...</p>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <SearchIcon className="h-12 w-12 text-amber-400 mb-4" />
            <h3 className="text-lg font-semibold mb-1 text-amber-800 dark:text-amber-300">کتابی یافت نشد</h3>
            <p className="text-amber-700/80 dark:text-amber-400/80">
              با معیارهای جستجو و فیلتر انتخاب شده هیچ کتابی یافت نشد. لطفاً معیارهای خود را تغییر دهید.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                <TableHead 
                  className="w-12 text-center cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center justify-center">
                    <span>#</span>
                    {sortColumn === 'id' && (
                      <ArrowDownUp className={`h-3 w-3 mr-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    <span>عنوان کتاب</span>
                    {sortColumn === 'title' && (
                      <ArrowDownUp className={`h-3 w-3 mr-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center">
                    <span>نویسنده</span>
                    {sortColumn === 'author' && (
                      <ArrowDownUp className={`h-3 w-3 mr-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort('pages')}
                >
                  <div className="flex items-center justify-center">
                    <span>تعداد صفحات</span>
                    {sortColumn === 'pages' && (
                      <ArrowDownUp className={`h-3 w-3 mr-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort('readers')}
                >
                  <div className="flex items-center justify-center">
                    <span>خوانندگان</span>
                    {sortColumn === 'readers' && (
                      <ArrowDownUp className={`h-3 w-3 mr-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-center"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center justify-center">
                    <span>وضعیت</span>
                    {sortColumn === 'status' && (
                      <ArrowDownUp className={`h-3 w-3 mr-1 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((book) => (
                <TableRow key={book.id} className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                  <TableCell className="text-center font-medium">{book.id}</TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{book.pages}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{book.readers}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={book.status === "active" ? "default" : "secondary"}
                      className={book.status === "active" 
                        ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}
                    >
                      {book.status === "active" ? "فعال" : "غیرفعال"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-1 space-x-reverse">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              asChild
                            >
                              <Link href={`/admin-secure-dashboard-xyz123/books/edit-content/${book.id}`}>
                                <FileText className="h-4 w-4 text-amber-600" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ویرایش محتوا</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              asChild
                            >
                              <Link href={`/admin-secure-dashboard-xyz123/books/edit/${book.id}`}>
                                <Pencil className="h-4 w-4 text-blue-600" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ویرایش کتاب</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin-secure-dashboard-xyz123/books/view/${book.id}`} className="flex cursor-pointer">
                              <BookOpen className="ml-2 h-4 w-4" />
                              مشاهده جزئیات
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin-secure-dashboard-xyz123/books/edit/${book.id}`} className="flex cursor-pointer">
                              <Pencil className="ml-2 h-4 w-4" />
                              ویرایش
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin-secure-dashboard-xyz123/books/edit-content/${book.id}`} className="flex cursor-pointer">
                              <FileText className="ml-2 h-4 w-4" />
                              ویرایش محتوا
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => toggleBookStatus(book.id)}
                            className="flex cursor-pointer"
                          >
                            {book.status === "active" ? (
                              <>
                                <EyeOff className="ml-2 h-4 w-4" />
                                غیرفعال کردن
                              </>
                            ) : (
                              <>
                                <Eye className="ml-2 h-4 w-4" />
                                فعال کردن
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setBookToDelete(book)
                              setDeleteDialogOpen(true)
                            }}
                            className="text-red-600 flex cursor-pointer"
                          >
                            <Trash className="ml-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!isLoading && filteredBooks.length > 0 && (
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-amber-100 dark:border-amber-800/40">
            <div className="text-sm text-amber-700/80 dark:text-amber-400/80 mb-4 sm:mb-0">
              نمایش {indexOfFirstItem + 1} تا {Math.min(indexOfLastItem, filteredBooks.length)} از {filteredBooks.length} کتاب
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-amber-200 text-amber-800 hover:bg-amber-100/50 hover:text-amber-900 dark:border-amber-800/40 dark:text-amber-300 dark:hover:bg-amber-900/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {pageNumbers.map(number => (
                <Button 
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm" 
                  onClick={() => paginate(number)}
                  className={currentPage === number 
                    ? "bg-amber-600 hover:bg-amber-700 text-white" 
                    : "border-amber-200 text-amber-800 hover:bg-amber-100/50 hover:text-amber-900 dark:border-amber-800/40 dark:text-amber-300 dark:hover:bg-amber-900/20"}
                >
                  {number}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-amber-200 text-amber-800 hover:bg-amber-100/50 hover:text-amber-900 dark:border-amber-800/40 dark:text-amber-300 dark:hover:bg-amber-900/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-800 dark:text-amber-300">
              تأیید حذف کتاب
            </DialogTitle>
            <DialogDescription>
              آیا از حذف کتاب <span className="font-bold text-amber-700 dark:text-amber-400">{bookToDelete?.title}</span> اطمینان دارید؟
              این عمل غیرقابل بازگشت است.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <DialogFooter className="flex flex-row-reverse sm:justify-start gap-2">
            <Button 
              variant="destructive" 
              onClick={handleDeleteBook}
            >
              بله، حذف شود
            </Button>
            <DialogClose asChild>
              <Button variant="outline">انصراف</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}