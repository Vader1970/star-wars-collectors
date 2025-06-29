
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Category } from '../types';
import CategoryCard from './CategoryCard';
import EmptyState from './EmptyState';
import { useAuth } from '../contexts/AuthContext';

interface CategoriesSectionProps {
  categories: Category[];
  onAddCategory: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onAddCategory,
  onEdit,
  onDelete,
  onView
}) => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-white mb-2">Collection Categories</h2>
          <p className="text-slate-400">
            Organize your memorabilia by era, type, and significance
          </p>
        </div>
        
        {/* Mobile: Button below text, Desktop: Button on the right - Only show to authenticated users */}
        {user && (
          <Button
            onClick={onAddCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white md:ml-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <EmptyState onAddCategory={onAddCategory} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              showActions={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;
