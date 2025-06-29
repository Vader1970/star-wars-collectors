import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { Category, Item } from "../types";

interface CategoryDbUpdates {
  updated_at: string;
  name?: string;
  description?: string;
  image?: string;
  parent_id?: string | null;
}

interface ItemDbUpdates {
  updated_at: string;
  name?: string;
  category_id?: string;
  stock_status?: string;
  rating?: string;
  valuation?: number;
  image?: string;
  images?: string[];
  manufacturer?: string;
  year_manufactured?: number;
  afa_number?: string;
  afa_grade?: string;
  description?: string;
  bought_for?: number;
  variations?: string;
}

export const useCollectionOperations = () => {
  const { user } = useAuth();

  const addCategoryWithAuth = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    if (!user) {
      throw new Error("User must be authenticated to add categories");
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image,
          parent_id: categoryData.parentId, // Map parentId to parent_id
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const updateCategoryWithAuth = async (id: string, updates: Partial<Category>) => {
    if (!user) {
      throw new Error("User must be authenticated to update categories");
    }

    // Map camelCase to snake_case for database
    const dbUpdates: CategoryDbUpdates = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.parentId !== undefined) dbUpdates.parent_id = updates.parentId;

    const { data, error } = await supabase
      .from("categories")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const deleteCategoryWithAuth = async (id: string) => {
    if (!user) {
      throw new Error("User must be authenticated to delete categories");
    }

    const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      throw error;
    }
  };

  const addItemWithAuth = async (itemData: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
    if (!user) {
      throw new Error("User must be authenticated to add items");
    }

    const { data, error } = await supabase
      .from("items")
      .insert([
        {
          name: itemData.name,
          category_id: itemData.categoryId, // Map categoryId to category_id
          stock_status: itemData.stockStatus, // Map stockStatus to stock_status
          rating: itemData.rating,
          valuation: itemData.valuation,
          image: itemData.image,
          images: itemData.images,
          manufacturer: itemData.manufacturer,
          year_manufactured: itemData.yearManufactured, // Map yearManufactured to year_manufactured
          afa_number: itemData.afaNumber, // Map afaNumber to afa_number
          afa_grade: itemData.afaGrade, // Map afaGrade to afa_grade
          description: itemData.description,
          bought_for: itemData.boughtFor, // Map boughtFor to bought_for
          variations: itemData.variations,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const updateItemWithAuth = async (id: string, updates: Partial<Item>) => {
    if (!user) {
      throw new Error("User must be authenticated to update items");
    }

    // Map camelCase to snake_case for database
    const dbUpdates: ItemDbUpdates = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.stockStatus !== undefined) dbUpdates.stock_status = updates.stockStatus;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.valuation !== undefined) dbUpdates.valuation = updates.valuation;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.manufacturer !== undefined) dbUpdates.manufacturer = updates.manufacturer;
    if (updates.yearManufactured !== undefined) dbUpdates.year_manufactured = updates.yearManufactured;
    if (updates.afaNumber !== undefined) dbUpdates.afa_number = updates.afaNumber;
    if (updates.afaGrade !== undefined) dbUpdates.afa_grade = updates.afaGrade;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.boughtFor !== undefined) dbUpdates.bought_for = updates.boughtFor;
    if (updates.variations !== undefined) dbUpdates.variations = updates.variations;

    const { data, error } = await supabase
      .from("items")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const deleteItemWithAuth = async (id: string) => {
    if (!user) {
      throw new Error("User must be authenticated to delete items");
    }

    const { error } = await supabase.from("items").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      throw error;
    }
  };

  return {
    addCategoryWithAuth,
    updateCategoryWithAuth,
    deleteCategoryWithAuth,
    addItemWithAuth,
    updateItemWithAuth,
    deleteItemWithAuth,
  };
};
