import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const wordSchema = z.object({
  word: z.string().min(1, "کلمه الزامی است"),
  meaning: z.string().min(1, "معنی کلمه الزامی است"),
  explanation: z.string().min(1, "توضیحات کلمه الزامی است"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "سطح کلمه الزامی است",
  }),
});

type WordFormData = z.infer<typeof wordSchema>;

interface Word extends WordFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  original?: string;
}

interface WordManagementProps {
  words: Word[];
  onAddWord: (data: WordFormData) => Promise<void>;
  onUpdateWord: (id: string, data: WordFormData) => Promise<void>;
  onDeleteWord: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const columns: ColumnDef<Word>[] = [
  {
    accessorKey: "word",
    header: "کلمه",
  },
  {
    accessorKey: "meaning",
    header: "معنی",
  },
  {
    accessorKey: "level",
    header: "سطح",
    cell: ({ row }) => {
      const level = row.getValue("level") as string;
      const levelMap = {
        beginner: "مبتدی",
        intermediate: "متوسط",
        advanced: "پیشرفته",
      };
      return levelMap[level as keyof typeof levelMap];
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ ایجاد",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("fa-IR");
    },
  },
];

export function WordManagement({
  words,
  onAddWord,
  onUpdateWord,
  onDeleteWord,
  isLoading = false,
}: WordManagementProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<WordFormData>({
    resolver: zodResolver(wordSchema),
    defaultValues: selectedWord || undefined,
  });

  const onSubmitForm = async (data: WordFormData) => {
    try {
      setError(null);
      if (selectedWord) {
        await onUpdateWord(selectedWord.id, data);
        toast({
          title: "موفقیت",
          description: "کلمه با موفقیت ویرایش شد",
        });
      } else {
        await onAddWord(data);
        toast({
          title: "موفقیت",
          description: "کلمه با موفقیت اضافه شد",
        });
      }
      reset();
      setSelectedWord(null);
    } catch (error) {
      setError("خطا در ذخیره کلمه");
      toast({
        title: "خطا",
        description: "خطا در ذخیره کلمه",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteWord(id);
      toast({
        title: "موفقیت",
        description: "کلمه با موفقیت حذف شد",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در حذف کلمه",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (word: Word) => {
    setSelectedWord(word);
    reset({
      word: word.word,
      meaning: word.meaning,
      explanation: word.explanation,
      level: word.level,
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <p>{error}</p>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="word">کلمه</Label>
            <Input
              id="word"
              placeholder="کلمه را وارد کنید"
              {...register("word")}
            />
            {errors.word && (
              <p className="text-sm text-destructive">{errors.word.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meaning">معنی</Label>
            <Input
              id="meaning"
              placeholder="معنی کلمه را وارد کنید"
              {...register("meaning")}
            />
            {errors.meaning && (
              <p className="text-sm text-destructive">{errors.meaning.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">سطح</Label>
            <Select
              onValueChange={(value) => setValue("level", value as WordFormData["level"])}
              defaultValue={selectedWord?.level}
            >
              <SelectTrigger className={errors.level ? "border-destructive" : ""}>
                <SelectValue placeholder="سطح کلمه را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">مبتدی</SelectItem>
                <SelectItem value="intermediate">متوسط</SelectItem>
                <SelectItem value="advanced">پیشرفته</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && (
              <p className="text-sm text-destructive">{errors.level.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="explanation">توضیحات</Label>
          <Textarea
            id="explanation"
            placeholder="توضیحات کلمه را وارد کنید"
            {...register("explanation")}
            className="min-h-[100px]"
          />
          {errors.explanation && (
            <p className="text-sm text-destructive">{errors.explanation.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {selectedWord && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedWord(null);
              }}
            >
              انصراف
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedWord ? "ویرایش" : "افزودن"}
          </Button>
        </div>
      </form>

      <DataTable
        columns={columns}
        data={words}
        onRowClick={(row) => {
          const word = words.find(w => w.id === row.id);
          if (word) {
            handleEdit(word);
          }
        }}
        onDelete={(row) => handleDelete(row.id)}
      />
    </div>
  );
} 