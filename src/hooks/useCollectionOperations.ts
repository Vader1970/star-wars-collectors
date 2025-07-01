import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { Category, Item } from "../types";
import { deleteImageFromCloudflare } from "../services/cloudflareImages";

interface CategoryDbUpdates {
  updated_at: string;
  name?: string;
  description?: string;
  image?: string;
  cloudflare_id?: string;
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
  cloudflare_id?: string;
  images?: string[];
  cloudflare_ids?: string[];
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
          cloudflare_id: categoryData.cloudflareId, // Add cloudflare_id
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
    if (updates.cloudflareId !== undefined) dbUpdates.cloudflare_id = updates.cloudflareId;
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

    // First, get the category to find its cloudflare_id
    const { data: category } = await supabase
      .from("categories")
      .select("cloudflare_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    // Delete the category from database
    const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      throw error;
    }

    // Delete the image from Cloudflare if it exists
    if (category?.cloudflare_id) {
      await deleteImageFromCloudflare(category.cloudflare_id);
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
          cloudflare_id: itemData.cloudflareId, // Add cloudflare_id
          images: itemData.images,
          cloudflare_ids: itemData.cloudflareIds, // Add cloudflare_ids
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
    if (updates.cloudflareId !== undefined) dbUpdates.cloudflare_id = updates.cloudflareId;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.cloudflareIds !== undefined) dbUpdates.cloudflare_ids = updates.cloudflareIds;
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

    // First, get the item to find its cloudflare IDs
    const { data: item } = await supabase
      .from("items")
      .select("cloudflare_id, cloudflare_ids")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    // Delete the item from database
    const { error } = await supabase.from("items").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      throw error;
    }

    // Delete images from Cloudflare if they exist
    if (item) {
      // Delete main image
      if (item.cloudflare_id) {
        await deleteImageFromCloudflare(item.cloudflare_id);
      }

      // Delete multiple images
      if (item.cloudflare_ids && item.cloudflare_ids.length > 0) {
        for (const cloudflareId of item.cloudflare_ids) {
          await deleteImageFromCloudflare(cloudflareId);
        }
      }
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
