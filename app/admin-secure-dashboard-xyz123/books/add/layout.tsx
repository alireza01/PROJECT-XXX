import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Book | Admin Dashboard",
  description: "Add a new book to the library catalog",
};

export default function AddBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 