"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCollection } from "@/contexts/CollectionContext";
import { useAuth } from "@/contexts/AuthContext";
import CategoryContent from "@/components/CategoryContent";
import CategoryHeader from "@/components/CategoryHeader";
import CategoryModal from "@/components/CategoryModal";
import ItemModal from "@/components/ItemModal";
import { Category, Item } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { categories, items, addCategory, updateCategory, deleteCategory, addItem, updateItem, deleteItem } =
    useCollection();

  const categoryId = params?.categoryId as string;
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Get current category and its subcategories/items
  const subcategories = categories.filter((cat) => cat.parentId === categoryId);
  const categoryItems = items.filter((item) => item.categoryId === categoryId);

  useEffect(() => {
    if (categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);
      setCurrentCategory(category || null);
    }
  }, [categoryId, categories]);

  const handleAddSubcategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
  };

  const handleViewCategory = (id: string) => {
    router.push(`/category/${id}`);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
  };

  const handleViewItemDetails = (id: string) => {
    router.push(`/item/${id}`);
  };

  const handleCategoryModalSave = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData);
    } else {
      await addCategory({
        ...categoryData,
        parentId: categoryId,
      });
    }
    setIsCategoryModalOpen(false);
  };

  const handleItemModalSave = async (itemData: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
    if (editingItem) {
      await updateItem(editingItem.id, itemData);
    } else {
      await addItem({
        ...itemData,
        categoryId: categoryId,
      });
    }
    setIsItemModalOpen(false);
  };

  const handleBackNavigation = () => {
    // Find parent category and navigate to it
    if (currentCategory?.parentId) {
      router.push(`/category/${currentCategory.parentId}`);
    } else {
      router.push("/");
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (!currentCategory) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-slate-900 min-h-screen'>
      <CategoryHeader
        currentCategory={currentCategory}
        onBackNavigation={handleBackNavigation}
        onBackToHome={handleBackToHome}
      />

      <CategoryContent
        user={user}
        subcategories={subcategories}
        categoryItems={categoryItems}
        onAddSubcategory={handleAddSubcategory}
        onAddItem={handleAddItem}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onViewCategory={handleViewCategory}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        onViewItemDetails={handleViewItemDetails}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleCategoryModalSave}
        category={editingCategory}
        parentId={categoryId}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleItemModalSave}
        item={editingItem}
        categoryId={categoryId}
      />
    </div>
  );
}
