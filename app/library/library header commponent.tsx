// @/components/library/library-header.tsx
import { SearchIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface LibraryHeaderProps {
  categories: Category[];
  totalBooks: number;
  activeCategory?: string;
  activeLevel?: string;
  query?: string;
}

export function LibraryHeader({ 
  categories, 
  totalBooks, 
  activeCategory, 
  activeLevel, 
  query = ''
}: LibraryHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(query);
  const [isPending, startTransition] = useTransition();
  
  // Levels for filtering
  const levels = [
    { id: 'beginner', name: 'مبتدی' },
    { id: 'intermediate', name: 'متوسط' },
    { id: 'advanced', name: 'پیشرفته' }
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'newest', name: 'جدیدترین' },
    { id: 'rating', name: 'بالاترین امتیاز' },
    { id: 'title', name: 'الفبایی' }
  ];
  
  // Handle form submission for search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(() => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams();
      
      // Add the search query if it exists
      if (searchQuery) {
        params.set('q', searchQuery);
      }
      
      // Preserve other active filters
      if (activeCategory) {
        params.set('category', activeCategory);
      }
      
      if (activeLevel) {
        params.set('level', activeLevel);
      }
      
      // Navigate to the new URL
      router.push(`${pathname}?${params.toString()}`);
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (type: 'category' | 'level' | 'sort', value: string) => {
    startTransition(() => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams();
      
      // Preserve search query if it exists
      if (query) {
        params.set('q', query);
      }
      
      // Set the new filter value
      if (type === 'category') {
        if (value !== activeCategory) {
          params.set('category', value);
        }
      } else if (type === 'level') {
        if (value !== activeLevel) {
          params.set('level', value);
        }
      } else if (type === 'sort') {
        params.set('sort', value);
      }
      
      // Preserve other active filters
      if (type !== 'category' && activeCategory) {
        params.set('category', activeCategory);
      }
      
      if (type !== 'level' && activeLevel) {
        params.set('level', activeLevel);
      }
      
      // Navigate to the new URL
      router.push(`${pathname}?${params.toString()}`);
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-right">کتابخانه</h1>
          <p className="text-muted-foreground text-right mt-1">
            {totalBooks} کتاب در مجموعه ما
          </p>
        </div>
        
        {/* Search form */}
        <form 
          onSubmit={handleSearch} 
          className="flex w-full max-w-sm items-center space-x-2 space-x-reverse rtl:space-x-reverse"
        >
          <Input
            type="search"
            placeholder="جستجوی کتاب..."
            className="text-right"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={isPending}>
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      {/* Filter section */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile filter trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <FilterIcon className="h-4 w-4 mr-2" />
                فیلترها
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>فیلترها</SheetTitle>
                <SheetDescription>
                  فیلترهای مورد نظر خود را انتخاب کنید
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Categories in mobile view */}
                <div>
                  <h3 className="font-medium mb-3">دسته‌بندی</h3>
                  <RadioGroup value={activeCategory || ''} className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                      <RadioGroupItem 
                        id="all-categories-mobile" 
                        value="" 
                        onClick={() => handleFilterChange('category', '')}
                      />
                      <Label htmlFor="all-categories-mobile">همه</Label>
                    </div>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                        <RadioGroupItem 
                          id={`${category.id}-mobile`} 
                          value={category.id}
                          onClick={() => handleFilterChange('category', category.id)}
                        />
                        <Label htmlFor={`${category.id}-mobile`}>
                          {category.name} ({category.count})
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {/* Levels in mobile view */}
                <div>
                  <h3 className="font-medium mb-3">سطح</h3>
                  <RadioGroup value={activeLevel || ''} className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                      <RadioGroupItem 
                        id="all-levels-mobile" 
                        value="" 
                        onClick={() => handleFilterChange('level', '')}
                      />
                      <Label htmlFor="all-levels-mobile">همه</Label>
                    </div>
                    {levels.map((level) => (
                      <div key={level.id} className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                        <RadioGroupItem 
                          id={`${level.id}-mobile`} 
                          value={level.id}
                          onClick={() => handleFilterChange('level', level.id)}
                        />
                        <Label htmlFor={`${level.id}-mobile`}>{level.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {/* Sort options in mobile view */}
                <div>
                  <h3 className="font-medium mb-3">مرتب‌سازی</h3>
                  <RadioGroup defaultValue="newest" className="space-y-2">
                    {sortOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                        <RadioGroupItem 
                          id={`${option.id}-mobile`} 
                          value={option.id}
                          onClick={() => handleFilterChange('sort', option.id)}
                        />
                        <Label htmlFor={`${option.id}-mobile`}>{option.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={clearFilters}
                >
                  پاک کردن فیلترها
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop category badges */}
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            <Badge 
              variant={!activeCategory ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleFilterChange('category', '')}
            >
              همه
            </Badge>
            {categories.map((category) => (
              <Badge 
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleFilterChange('category', category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
          
          {/* Desktop level badges */}
          <div className="hidden md:flex md:flex-wrap md:gap-2 md:mr-4">
            {levels.map((level) => (
              <Badge 
                key={level.id}
                variant={activeLevel === level.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleFilterChange('level', level.id)}
              >
                {level.name}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Active filters indicator and clear button */}
        {(activeCategory || activeLevel || query) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="hidden md:inline-flex"
          >
            پاک کردن فیلترها
          </Button>
        )}
      </div>
    </div>
  );
}