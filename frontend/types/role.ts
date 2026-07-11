export interface Role {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
}
