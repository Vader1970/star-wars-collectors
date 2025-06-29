
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CategoryModal from './CategoryModal';
import ItemModal from './ItemModal';
import { Category, Item } from '../types';

interface User {
  id: string;
  email?: string;
}

interface CategoryModalsProps {
  user: User | null;
  categoryId: string;
  // Category modal props
  isModalOpen: boolean;
  editingCategory: Category | null;
  onCloseModal: () => void;
  onSaveCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  // Item modal props
  isItemModalOpen: boolean;
  editingItem: Item | null;
  onCloseItemModal: () => void;
  onSaveItem: (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  // Delete dialogs props
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onDeleteConfirm: () => void;
  itemDeleteDialogOpen: boolean;
  setItemDeleteDialogOpen: (open: boolean) => void;
  onDeleteItemConfirm: () => void;
}

const CategoryModals: React.FC<CategoryModalsProps> = ({
  user,
  categoryId,
  isModalOpen,
  editingCategory,
  onCloseModal,
  onSaveCategory,
  isItemModalOpen,
  editingItem,
  onCloseItemModal,
  onSaveItem,
  deleteDialogOpen,
  setDeleteDialogOpen,
  onDeleteConfirm,
  itemDeleteDialogOpen,
  setItemDeleteDialogOpen,
  onDeleteItemConfirm
}) => {
  if (!user) return null;

  return (
    <>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSave={onSaveCategory}
        category={editingCategory}
        parentId={categoryId}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={onCloseItemModal}
        onSave={onSaveItem}
        item={editingItem}
        categoryId={categoryId}
      />

      {/* Category Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              No
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Item Delete Dialog */}
      <AlertDialog open={itemDeleteDialogOpen} onOpenChange={setItemDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Item</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              No
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteItemConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryModals;
