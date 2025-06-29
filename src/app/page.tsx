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
import TopStatsBar from "../components/TopStatsBar";
import AdminSheet from "../components/AdminSheet";
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
  const [adminSheetOpen, setAdminSheetOpen] = useState(false);
  const [heroEditOpen, setHeroEditOpen] = useState(false);

  // Only show top-level categories (no parentId)
  const topLevelCategories = categories.filter((cat) => !cat.parentId);

  // "Items published" should be the number of items (NOT categories)
  const totalPublished = items.length;

  // "In stock" is the count of items with stockStatus === 'In Stock'
  const totalInStock = items.filter((item) => item.stockStatus === "In Stock").length;

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

  const handleSave = (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setEditingCategory(null);
  };

  const handleView = (id: string) => {
    router.push(`/category/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteCategory(categoryToDelete);
    setDeleteDialogOpen(false);
    setCategoryToDelete("");
  };

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleEditHero = () => {
    setHeroEditOpen(true);
  };

  if (heroLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-slate-900 to-black'>
      <TopStatsBar totalPublished={totalPublished} totalInStock={totalInStock} />

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
          <AlertDialogContent className='bg-slate-900 border-slate-700 text-white'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-white'>Delete Category</AlertDialogTitle>
              <AlertDialogDescription className='text-slate-300'>
                Are you sure you want to delete this category? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='bg-slate-800 border-slate-600 text-white hover:bg-slate-700'>
                No
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className='bg-red-600 hover:bg-red-700 text-white'>
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <AdminSheet open={adminSheetOpen} onOpenChange={setAdminSheetOpen} />
    </div>
  );
}
