
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface User {
  id: string;
  email?: string;
}

interface CategoryToggleProps {
  showItems: boolean;
  onToggle: (showItems: boolean) => void;
  user: User | null;
}

const CategoryToggle: React.FC<CategoryToggleProps> = ({
  showItems,
  onToggle,
  user
}) => {
  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={!showItems ? "default" : "outline"}
          onClick={() => onToggle(false)}
          className={!showItems ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 border-slate-600 text-white hover:bg-slate-700"}
        >
          Subcategories
        </Button>
        <Button
          variant={showItems ? "default" : "outline"}
          onClick={() => onToggle(true)}
          className={showItems ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 border-slate-600 text-white hover:bg-slate-700"}
        >
          <Package className="w-4 h-4 mr-2" />
          Items
        </Button>
      </div>
    </div>
  );
};

export default CategoryToggle;
