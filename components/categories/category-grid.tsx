"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Link href={`/categories/${category.id}`}>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-amber-200 dark:border-amber-800/40 dark:bg-gray-900 h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#5D4B35]">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-[#E6D7B8] text-[#5D4B35] hover:bg-[#D29E64] hover:text-white">
                  {category.count} کتاب
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
} 