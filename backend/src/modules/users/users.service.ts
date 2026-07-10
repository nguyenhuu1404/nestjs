// modules/users/users.service.ts
import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserDto } from './v1/dto/create-user.dto';
import { UpdateUserDto } from './v1/dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from '@core/repositories/users.repository';
import { RolesRepository } from '@core/repositories/roles.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private rolesRepository: RolesRepository,
    private userMapper: UserMapper,
  ) {}

  private async validateRoleIds(roleIds?: number[]): Promise<void> {
    if (!roleIds?.length) return;
    const found = await this.rolesRepository.findByIds(roleIds);
    if (found.length !== roleIds.length) {
      const foundIds = found.map((r) => r.id);
      const missing = roleIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(`roleId không tồn tại: ${missing.join(', ')}`);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.findAll();
    return this.userMapper.toEntities(users);
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy user');
    return this.userMapper.toEntity(user);
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email đã được sử dụng');

    const { roleIds, password, ...rest } = dto;
    await this.validateRoleIds(roleIds);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.createWithRoles({ ...rest, password: hashedPassword }, roleIds);
    return this.userMapper.toEntity(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    await this.findOne(id);
    const { roleIds, ...rest } = dto;
    await this.validateRoleIds(roleIds);

    const user = await this.usersRepository.updateWithRoles(id, rest, roleIds);
    return this.userMapper.toEntity(user);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);
  }
}
