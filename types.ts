
export interface Ordnance {
  id: string;
  name: string;
  localName?: string;
  category: string;
  subCategory: string;
  hierarchy: string[]; // [MunDB2, Categorie, SousCategorie, ...]
  country: string;
  fill?: string;
  weight?: string;
  dimensions?: string;
  fuze?: string;
  description: string;
  warning?: string;
  imageUrls: string[]; 
  tags: string[];
}

export interface UserStats {
  masteryLevel: number; // 0 to 5
  lastReviewed: string;
  easyCount: number;
  hardCount: number;
}

export interface CustomList {
  id: string;
  name: string;
  itemIds: string[];
  categoryNames: string[];
  createdAt: string;
}

export type AppView = 'catalogue' | 'revision' | 'home';
