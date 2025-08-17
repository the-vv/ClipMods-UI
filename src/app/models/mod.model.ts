export interface Mod {
  id?: string;
  name: string;
  description: string;
  code: string;
  author?: string;
  version: number;
  created?: Date;
  updated?: Date;
  tags?: string[];
  isPublic: boolean;
  inputCount: number;
  publicApprovalStatus?: 'pending' | 'approved' | 'rejected' | null;
  lastUsed?: Date;
}
