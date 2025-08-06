export interface Mod {
  id: string;
  name: string;
  description: string;
  code?: string;
  author?: string;
  version?: string;
  created?: Date;
  updated?: Date;
  tags?: string[];
  isPublic?: boolean;
  publicApprovalStatus?: 'pending' | 'approved' | 'rejected' | null;
}
