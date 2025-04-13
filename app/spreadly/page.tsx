'use client';

import { SpreadlyGrid } from '@/components/spreadly/SpreadlyGrid';

export default function SpreadlyPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Maula Spreadly</h1>
      <div className="mb-4 rounded-lg bg-gray-50 p-4">
        <p className="text-gray-600">
          A modern, dynamic spreadsheet component built with React and TypeScript.
        </p>
      </div>
      <SpreadlyGrid rows={20} columns={10} className="h-[600px]" />
    </div>
  );
} 