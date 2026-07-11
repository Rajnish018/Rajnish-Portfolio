export interface Project {
  _id?: string;
  title: string;
  description: string;
  category: string;
  image: string | string[];
  tags: string[];
  status: string;
  githubLink: string;
  previewLink: string;
}

// 1. Updated individual Skill interface
export interface Skill {
  _id?: string; // Optional for MongoDB IDs
  name: string;
  level: number; // 0-100
}

// 2. Added Category Configuration interface
export interface CategoryConfig {
  hex?: string;    // Custom hex color code
  icon?: string;   // Icon identifier
  color?: string;  // General color name (e.g., 'emerald')
}

// 3. Added SkillCategory interface
export interface SkillCategory {
  _id?: string;
  categoryName: string;
  items: Skill[];
  config?: CategoryConfig;
}

// 4. Updated SkillSet to contain the categories array
export interface SkillSet {
  _id?: string;
  categories: SkillCategory[];
  updatedAt?: string;
}

export interface Message {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date?: string;
  createdAt?: string;
  avatar?: string;
}

export interface Stats {
  totalProjects: number;
  messageCount: number;
  totalViews: number;
  performance?: string;
  monthlyProjectGrowth?: number;
  traffic?: number[];
  pendingMessages?: number;
  storage?: {
    used: number;
    total: number;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}
