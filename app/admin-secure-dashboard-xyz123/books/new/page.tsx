"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBook } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewBookPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createBook(formData)
      if (result.success) {
        router.push("/admin-secure-dashboard-xyz123/books")
      } else {
        setError(result.error || "خطا در ارسال فرم")
      }
    } catch (err) {
      setError("خطا در ارسال فرم")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>افزودن کتاب جدید</CardTitle>
          <div className="text-sm text-muted-foreground">لطفا اطلاعات کتاب را وارد کنید</div>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">عنوان کتاب</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="عنوان کتاب را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">نویسنده</Label>
              <Input
                id="author"
                name="author"
                required
                placeholder="نام نویسنده را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">سطح</Label>
              <Select name="level" required>
                <SelectTrigger>
                  <SelectValue placeholder="سطح کتاب را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">مقدماتی</SelectItem>
                  <SelectItem value="intermediate">متوسط</SelectItem>
                  <SelectItem value="advanced">پیشرفته</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">زبان</Label>
              <Select name="language" required>
                <SelectTrigger>
                  <SelectValue placeholder="زبان کتاب را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="persian">فارسی</SelectItem>
                  <SelectItem value="english">انگلیسی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">تعداد صفحات</Label>
              <Input
                id="pages"
                name="pages"
                type="number"
                required
                min="1"
                placeholder="تعداد صفحات را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">تصویر جلد</Label>
              <Input
                id="cover"
                name="cover"
                type="file"
                required
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="توضیحات کتاب را وارد کنید"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "در حال ذخیره..." : "ذخیره کتاب"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 