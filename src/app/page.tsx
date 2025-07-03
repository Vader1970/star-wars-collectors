"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCollection } from "../contexts/CollectionContext";
import { useHero } from "../contexts/HeroContext";
import { useAuth } from "../contexts/AuthContext";
import CategoryModal from "../components/CategoryModal";
import HeroEditModal from "../components/HeroEditModal";
import { Category } from "../types";
import HeroSection from "../components/HeroSection";
import SearchSection from "../components/SearchSection";
import CategoriesSection from "../components/CategoriesSection";

export default function HomePage() {
  const router = useRouter();
  const { categories, items, deleteCategory, addCategory, updateCategory } = useCollection();
  const { loading: heroLoading } = useHero();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string>("");
  const [selectedValCategory, setSelectedValCategory] = useState<string>("");
  const [heroEditOpen, setHeroEditOpen] = useState(false);

  // Only show top-level categories (no parentId)
  const topLevelCategories = categories.filter((cat) => !cat.parentId);

  // For the Group Valuation: include categories where at least one item is In Stock and has a valuation
  const groupValuationCategories = categories.filter((cat) =>
    items.some(
      (item) =>
        item.categoryId === cat.id &&
        item.stockStatus === "In Stock" &&
        typeof item.valuation === "number" &&
        item.valuation > 0
    )
  );

  // Sort categories alphabetically
  groupValuationCategories.sort((a, b) => a.name.localeCompare(b.name));

  const handleValCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedValCategory(val);
    if (val && val !== "__placeholder__") {
      router.push(`/category/${val}`);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt"> | Partial<Category>) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData as Partial<Category>);
    } else {
      await addCategory(categoryData as Omit<Category, "id" | "createdAt" | "updatedAt">);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setDeleteDialogOpen(false);
      setCategoryToDelete("");
    }
  };

  const handleView = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditHero = () => {
    setHeroEditOpen(true);
  };

  if (heroLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-slate-900 to-black'>
      {/* Hero Section */}
      <HeroSection onEditHero={handleEditHero} onAddCategory={handleAddCategory} />

      {/* Search Section */}
      <SearchSection
        groupValuationCategories={groupValuationCategories}
        selectedValCategory={selectedValCategory}
        onValCategorySelect={handleValCategorySelect}
      />

      {/* Categories Section */}
      <CategoriesSection
        categories={topLevelCategories}
        onAddCategory={handleAddCategory}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onView={handleView}
      />

      {/* Modals - Only render if user is authenticated */}
      {user && (
        <>
          <CategoryModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingCategory(null);
            }}
            onSave={handleSave}
            category={editingCategory}
          />

          <HeroEditModal isOpen={heroEditOpen} onClose={() => setHeroEditOpen(false)} />
        </>
      )}

      {/* Delete Dialog - Only render if user is authenticated */}
      {user && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category and all its subcategories and
                items.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className='bg-red-600 hover:bg-red-700'>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
