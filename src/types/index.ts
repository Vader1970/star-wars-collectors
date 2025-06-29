
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  stockStatus: 'In Stock' | 'Out of Stock';
  rating?: string;
  valuation?: number;
  image?: string;
  images?: string[]; // New field for multiple images
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
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
}
