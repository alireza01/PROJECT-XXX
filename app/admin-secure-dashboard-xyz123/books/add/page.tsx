// @/app/admin-secure-dashboard-xyz123/books/add/page.tsx
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/admin/breadcrumb";

export default function AddBookPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("BEGINNER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("books")
        .insert({
          title,
          author,
          description,
          price: parseFloat(price),
          coverUrl: image,
          level,
          rating: 0,
          readingTime: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Book created successfully");
      router.push("/admin-secure-dashboard-xyz123/books");
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Failed to create book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin-secure-dashboard-xyz123" },
          { label: "Books", href: "/admin-secure-dashboard-xyz123/books" },
          { label: "Add Book", href: "/admin-secure-dashboard-xyz123/books/add" },
        ]}
      />
      
      <h1 className="text-3xl font-bold">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium">
            Author
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium">
            Level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as "BEGINNER" | "INTERMEDIATE" | "ADVANCED")}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}