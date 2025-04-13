import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const bookSchema = z.object({
  title: z.string().min(1, "عنوان کتاب الزامی است"),
  author: z.string().min(1, "نام نویسنده الزامی است"),
  description: z.string().min(1, "توضیحات کتاب الزامی است"),
  category: z.string().min(1, "دسته‌بندی کتاب الزامی است"),
  coverImage: z.string().optional(),
  isbn: z.string().optional(),
  language: z.string().min(1, "زبان کتاب الزامی است"),
  pageCount: z.number().min(1, "تعداد صفحات باید بیشتر از صفر باشد"),
  publisher: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  isLoading?: boolean;
}

export function BookForm({ initialData, onSubmit, isLoading = false }: BookFormProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = async (data: BookFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      toast({
        title: "موفقیت",
        description: "کتاب با موفقیت ذخیره شد",
      });
    } catch (error) {
      setError("خطا در ذخیره کتاب");
      toast({
        title: "خطا",
        description: "خطا در ذخیره کتاب",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان کتاب</Label>
            <Input
              id="title"
              placeholder="عنوان کتاب را وارد کنید"
              {...register("title")}
              error={errors.title?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">نویسنده</Label>
            <Input
              id="author"
              placeholder="نام نویسنده را وارد کنید"
              {...register("author")}
              error={errors.author?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">دسته‌بندی</Label>
            <Select
              id="category"
              placeholder="دسته‌بندی را انتخاب کنید"
              {...register("category")}
              error={errors.category?.message}
            >
              <option value="fiction">داستان</option>
              <option value="non-fiction">غیر داستانی</option>
              <option value="science">علمی</option>
              <option value="history">تاریخی</option>
              <option value="biography">زندگی‌نامه</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">زبان</Label>
            <Select
              id="language"
              placeholder="زبان کتاب را انتخاب کنید"
              {...register("language")}
              error={errors.language?.message}
            >
              <option value="fa">فارسی</option>
              <option value="en">انگلیسی</option>
              <option value="ar">عربی</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pageCount">تعداد صفحات</Label>
            <Input
              id="pageCount"
              type="number"
              placeholder="تعداد صفحات را وارد کنید"
              {...register("pageCount", { valueAsNumber: true })}
              error={errors.pageCount?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">شابک</Label>
            <Input
              id="isbn"
              placeholder="شابک را وارد کنید"
              {...register("isbn")}
              error={errors.isbn?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher">ناشر</Label>
            <Input
              id="publisher"
              placeholder="نام ناشر را وارد کنید"
              {...register("publisher")}
              error={errors.publisher?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">تصویر جلد</Label>
            <Input
              id="coverImage"
              placeholder="آدرس تصویر جلد را وارد کنید"
              {...register("coverImage")}
              error={errors.coverImage?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">توضیحات</Label>
          <Textarea
            id="description"
            placeholder="توضیحات کتاب را وارد کنید"
            {...register("description")}
            error={errors.description?.message}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          ذخیره
        </Button>
      </div>
    </form>
  );
} 