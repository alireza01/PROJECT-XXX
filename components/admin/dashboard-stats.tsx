// @/components/admin/dashboard-stats.tsx
import { getDashboardStats, getPopularBooks, getPopularWords } from "@/lib/data"; // Use functions from @/lib/data
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BookMarked, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils"; // Import utility

// Define ReadingLevel type locally based on schema
type ReadingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Define expected structure for popular books based on getPopularBooks return type
type PopularBook = {
    id: string;
    title: string;
    author: { name: string | null } | null; // Author might be null
    _count: {
        likes: number;
        bookmarks: number;
    };
    // Add other fields if included in getPopularBooks (e.g., category)
    category?: { name: string | null } | null;
};

// Define expected structure for popular words based on getPopularWords return type
type PopularWord = {
    id: string;
    word: string;
    level: ReadingLevel; // Use local type
    searchCount: number;
    // Add other fields if included in getPopularWords
};


export async function DashboardStats() {
  // Fetch data concurrently
  const [stats, popularBooks, popularWords] = await Promise.all([
    getDashboardStats(),
    getPopularBooks(5), // Limit to 5 as in original component
    getPopularWords(5)  // Limit to 5 as in original component
  ]);

  // Helper to get badge color based on level
  const getLevelColorClass = (level: ReadingLevel | string) => {
    switch (level) {
      case "ADVANCED": return "bg-purple-500";
      case "INTERMEDIATE": return "bg-blue-500";
      case "BEGINNER": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">کل کاربران</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.userCount)}</div>
            {/* <p className="text-xs text-green-500 flex items-center mt-1"><TrendingUp className="h-3 w-3 ml-1" /> 12% افزایش در ماه گذشته</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">کتاب‌های موجود</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.bookCount)}</div>
            {/* <p className="text-xs text-green-500 flex items-center mt-1"><TrendingUp className="h-3 w-3 ml-1" />8 کتاب جدید در ماه گذشته</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">کلمات در دیتابیس</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.wordCount)}</div>
            {/* <p className="text-xs text-green-500 flex items-center mt-1"><TrendingUp className="h-3 w-3 ml-1" /> 324 کلمه جدید در ماه گذشته</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مطالعات فعال (۷ روز)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.activeReadingCount)}</div>
            {/* <p className="text-xs text-green-500 flex items-center mt-1"><TrendingUp className="h-3 w-3 ml-1" /> 18% افزایش در هفته گذشته</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Popular Books & Words */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>کتاب‌های پرطرفدار</CardTitle>
            <CardDescription>بر اساس بازدید / لایک / نشانه‌گذاری</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks.length > 0 ? popularBooks.map((book: PopularBook) => ( // Explicitly type book
                <div key={book.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author?.name ?? 'ناشناس'}</p> {/* Handle null author */}
                  </div>
                  {/* Display likes/bookmarks count */}
                  <div className="text-sm text-muted-foreground">
                     {formatNumber(book._count.likes)} لایک / {formatNumber(book._count.bookmarks)} نشان
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground">کتاب پرطرفداری یافت نشد.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>کلمات پرجستجو</CardTitle>
            <CardDescription>بر اساس تعداد دفعات جستجو</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularWords.length > 0 ? popularWords.map((word: PopularWord) => ( // Explicitly type word
                <div key={word.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getLevelColorClass(word.level)}`} />
                    <p className="font-medium">{word.word}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatNumber(word.searchCount)} جستجو</div>
                </div>
              )) : <p className="text-sm text-muted-foreground">کلمه پرجستجویی یافت نشد.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}