// @/app/admin-secure-dashboard-xyz123/words/page.tsx
import { Metadata } from "next";
import { WordManagement } from "@/v2/components/admin/word-management";

// Define metadata for the page
export const metadata: Metadata = {
  title: "مدیریت واژگان | Admin Dashboard",
  description: "Page for managing vocabulary words",
};

export default function WordsManagementPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">مدیریت واژگان</h1>
        <p className="text-gray-600 text-sm">
          Add, edit, or remove vocabulary words from the system
        </p>
      </div>
      
      <WordManagement />
    </div>
  );
}