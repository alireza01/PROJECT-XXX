import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت واژگان | Admin Dashboard",
  description: "Page for managing vocabulary words",
};

export default function WordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 