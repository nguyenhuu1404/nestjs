export class RoleEntity {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    permissions: string[]; // ["users.create", "users.view"] — phẳng ra tên permission
    createdAt: Date;
  
    constructor(partial: Partial<RoleEntity>) {
      Object.assign(this, partial);
    }
  }
