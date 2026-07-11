export interface User {
  id: number;
  email: string;
  name: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}
