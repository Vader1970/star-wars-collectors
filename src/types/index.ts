export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  cloudflareId?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  stockStatus: "In Stock" | "Out of Stock";
  rating?: string;
  valuation?: number;
  image?: string;
  cloudflareId?: string;
  images?: string[]; // New field for multiple images
  cloudflareIds?: string[]; // Cloudflare IDs for multiple images
  manufacturer?: string;
  yearManufactured?: number;
  afaNumber?: string;
  afaGrade?: string;
  description?: string;
  boughtFor?: number;
  variations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionContextType {
  categories: Category[];
  items: Item[];
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}
