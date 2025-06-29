import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { Category, Item } from "../types";
import CategoryCard from "./CategoryCard";
import ItemCard from "./ItemCard";

interface User {
  id: string;
  email?: string;
}

interface CategoryContentProps {
  showItems: boolean;
  user: User | null;
  subcategories: Category[];
  categoryItems: Item[];
  onAddSubcategory: () => void;
  onAddItem: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onViewCategory: (id: string) => void;
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
  onViewItemDetails: (id: string) => void;
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  showItems,
  user,
  subcategories,
  categoryItems,
  onAddSubcategory,
  onAddItem,
  onEditCategory,
  onDeleteCategory,
  onViewCategory,
  onEditItem,
  onDeleteItem,
  onViewItemDetails,
}) => {
  const shouldShowItems = categoryItems.length > 0;

  if (shouldShowItems) {
    return (
      <div className='container mx-auto px-6 pb-8'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-bold text-white'>Items ({categoryItems.length})</h2>
          {user && (
            <Button onClick={onAddItem} className='bg-blue-600 hover:bg-blue-700 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Add Item
            </Button>
          )}
        </div>

        {categoryItems.length === 0 ? (
          <div className='text-center py-16'>
            <div className='text-slate-400 mb-4'>
              <div className='w-24 h-24 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center'>
                <Package className='w-8 h-8' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>No items yet</h3>
              <p className='text-slate-500 mb-6'>Add your first collectible item to this category.</p>
            </div>
            {user && (
              <Button onClick={onAddItem} className='bg-blue-600 hover:bg-blue-700 text-white'>
                <Plus className='w-4 h-4 mr-2' />
                Add First Item
              </Button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {categoryItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                onViewDetails={onViewItemDetails}
                showActions={!!user}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show subcategories
  return (
    <div className='container mx-auto px-6 pb-8'>
      <div className='flex justify-end items-center gap-3 mb-8'>
        {user && (
          <>
            <Button onClick={onAddSubcategory} className='bg-blue-600 hover:bg-blue-700 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Add Subcategory
            </Button>
            <Button onClick={onAddItem} className='bg-blue-600 hover:bg-blue-700 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Add Item
            </Button>
          </>
        )}
      </div>

      {subcategories.length === 0 ? (
        <div className='text-center py-16'>
          <div className='text-slate-400 mb-4'>
            <div className='w-24 h-24 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center'>
              <Plus className='w-8 h-8' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>No subcategories yet</h3>
            <p className='text-slate-500 mb-6'>Create your first subcategory to organize your collection.</p>
          </div>
          {user && (
            <Button onClick={onAddSubcategory} className='bg-blue-600 hover:bg-blue-700 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Add First Subcategory
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {subcategories.map((subcategory) => (
            <CategoryCard
              key={subcategory.id}
              category={subcategory}
              onEdit={onEditCategory}
              onDelete={onDeleteCategory}
              onView={onViewCategory}
              showActions={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryContent;
