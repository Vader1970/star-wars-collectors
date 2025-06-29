
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  showActions?: boolean;
}

const CategoryCard = ({ category, onEdit, onDelete, onView, showActions = true }: CategoryCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 hover:border-blue-500/50 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={category.image || '/placeholder.svg'}
          alt={category.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-slate-300 text-sm line-clamp-2">
            {category.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(category.id)}
          className="flex-1 bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 hover:border-blue-400"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        {showActions && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
              className="bg-yellow-600/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/20 hover:border-yellow-400"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(category.id)}
              className="bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20 hover:border-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
