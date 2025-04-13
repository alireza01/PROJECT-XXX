// @/app/admin-secure-dashboard-xyz123/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BookManagement } from '@/components/admin/book-management';
import { VocabularyManagement } from '@/components/admin/vocabulary-management';
import { UserManagement } from '@/components/admin/user-management';
import { Settings } from '@/components/admin/settings';
import Card from "@/components/ui/card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, FileText, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect('/');
  }

  const [booksCount, wordsCount, usersCount] = await Promise.all([
    prisma.book.count(),
    prisma.word.count(),
    prisma.user.count(),
  ]);

  const stats = [
    {
      title: "تعداد کتاب‌ها",
      value: booksCount,
      icon: Book,
    },
    {
      title: "تعداد واژگان",
      value: wordsCount,
      icon: FileText,
    },
    {
      title: "تعداد کاربران",
      value: usersCount,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">داشبورد مدیریت</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}