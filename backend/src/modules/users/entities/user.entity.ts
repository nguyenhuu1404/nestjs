import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  email: string;
  name: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
