export interface Mod {
  id: string;
  name: string;
  description: string;
  code?: string;
  author?: string;
  version?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  isPublic?: boolean;
}
