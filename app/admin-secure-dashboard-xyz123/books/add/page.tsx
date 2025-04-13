// @/app/admin-secure-dashboard-xyz123/books/add/page.tsx
import { Metadata } from "next";
import { BookForm } from "@/v2/components/admin/book-form";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Add New Book | Admin Dashboard",
  description: "Add a new book to the library catalog",
};

export default function AddBookPage() {
  // The breadcrumb paths for navigation
  const breadcrumbPaths = [
    { label: "Dashboard", href: "/admin-secure-dashboard-xyz123" },
    { label: "Books", href: "/admin-secure-dashboard-xyz123/books" },
    { label: "Add New Book", href: "/admin-secure-dashboard-xyz123/books/add" },
  ];
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <BreadcrumbNav paths={breadcrumbPaths} />
        <h1 className="text-2xl font-bold">Add New Book</h1>
        <p className="text-gray-500">Fill in the details to add a new book to the catalog</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <BookForm />
      </div>
      
      <div className="text-sm text-gray-500">
        <p>* Required fields</p>
        <p>All books will be reviewed before publication</p>
      </div>
    </div>
  );
}