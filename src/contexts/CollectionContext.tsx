"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category, Item, CollectionContextType } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useCollectionOperations } from "../hooks/useCollectionOperations";

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const { toast } = useToast();
  const {
    addCategoryWithAuth,
    updateCategoryWithAuth,
    deleteCategoryWithAuth,
    addItemWithAuth,
    updateItemWithAuth,
    deleteItemWithAuth,
  } = useCollectionOperations();

  const loadCategories = useCallback(async () => {
    try {
      // Only select the columns we actually need
      // Add pagination for better performance with large datasets
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, description, image, cloudflare_id, parent_id, created_at, updated_at")
        .order("created_at", { ascending: true })
        .limit(1000); // Limit to prevent massive queries

      if (error) throw error;

      const formattedCategories: Category[] = data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        cloudflareId: cat.cloudflare_id,
        parentId: cat.parent_id,
        createdAt: new Date(cat.created_at),
        updatedAt: new Date(cat.updated_at),
      }));

      setCategories(formattedCategories);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadItems = useCallback(async () => {
    try {
      // Only select the columns we actually need
      const { data, error } = await supabase
        .from("items")
        .select(
          "id, name, category_id, stock_status, rating, valuation, image, cloudflare_id, images, cloudflare_ids, manufacturer, year_manufactured, afa_number, afa_grade, description, bought_for, variations, created_at, updated_at"
        )
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedItems: Item[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        categoryId: item.category_id,
        stockStatus: item.stock_status as "In Stock" | "Out of Stock",
        rating: item.rating,
        valuation: item.valuation,
        image: item.image,
        cloudflareId: item.cloudflare_id,
        images: item.images,
        cloudflareIds: item.cloudflare_ids,
        manufacturer: item.manufacturer,
        yearManufactured: item.year_manufactured,
        afaNumber: item.afa_number,
        afaGrade: item.afa_grade,
        description: item.description,
        boughtFor: item.bought_for,
        variations: item.variations,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));

      setItems(formattedItems);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load data from Supabase on mount
  useEffect(() => {
    loadCategories();
    loadItems();
  }, [loadCategories, loadItems]);

  const addCategory = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newCategory = await addCategoryWithAuth(categoryData);

      const formattedCategory: Category = {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        image: newCategory.image,
        cloudflareId: newCategory.cloudflare_id,
        parentId: newCategory.parent_id,
        createdAt: new Date(newCategory.created_at),
        updatedAt: new Date(newCategory.updated_at),
      };

      setCategories((prev) => [...prev, formattedCategory]);

      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updatedData = await updateCategoryWithAuth(id, updates);

      const updatedCategory: Category = {
        id: updatedData.id,
        name: updatedData.name,
        description: updatedData.description,
        image: updatedData.image,
        cloudflareId: updatedData.cloudflare_id,
        parentId: updatedData.parent_id,
        createdAt: new Date(updatedData.created_at),
        updatedAt: new Date(updatedData.updated_at),
      };

      setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryWithAuth(id);

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setItems((prev) => prev.filter((item) => item.categoryId !== id));

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const addItem = async (itemData: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newItemData = await addItemWithAuth(itemData);

      const newItem: Item = {
        id: newItemData.id,
        name: newItemData.name,
        categoryId: newItemData.category_id,
        stockStatus: newItemData.stock_status,
        rating: newItemData.rating,
        valuation: newItemData.valuation,
        image: newItemData.image,
        cloudflareId: newItemData.cloudflare_id,
        images: newItemData.images,
        cloudflareIds: newItemData.cloudflare_ids,
        manufacturer: newItemData.manufacturer,
        yearManufactured: newItemData.year_manufactured,
        afaNumber: newItemData.afa_number,
        afaGrade: newItemData.afa_grade,
        description: newItemData.description,
        boughtFor: newItemData.bought_for,
        variations: newItemData.variations,
        createdAt: new Date(newItemData.created_at),
        updatedAt: new Date(newItemData.updated_at),
      };

      setItems((prev) => [...prev, newItem]);

      toast({
        title: "Success",
        description: "Item created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    try {
      const updatedData = await updateItemWithAuth(id, updates);

      const updatedItem: Item = {
        id: updatedData.id,
        name: updatedData.name,
        categoryId: updatedData.category_id,
        stockStatus: updatedData.stock_status,
        rating: updatedData.rating,
        valuation: updatedData.valuation,
        image: updatedData.image,
        cloudflareId: updatedData.cloudflare_id,
        images: updatedData.images,
        cloudflareIds: updatedData.cloudflare_ids,
        manufacturer: updatedData.manufacturer,
        yearManufactured: updatedData.year_manufactured,
        afaNumber: updatedData.afa_number,
        afaGrade: updatedData.afa_grade,
        description: updatedData.description,
        boughtFor: updatedData.bought_for,
        variations: updatedData.variations,
        createdAt: new Date(updatedData.created_at),
        updatedAt: new Date(updatedData.updated_at),
      };

      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteItemWithAuth(id);

      setItems((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  return (
    <CollectionContext.Provider
      value={{
        categories,
        items,
        addCategory,
        updateCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
};
