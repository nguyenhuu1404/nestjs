import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        permissions: { include: { permission: true } }, // UserPermission override trực tiếp
      },
    });

    if (!user || !user.isActive) throw new UnauthorizedException('Tài khoản không tồn tại hoặc bị khoá');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const roleNames = user.roles.map((ur) => ur.role.name);

    // Gộp permission từ Role (qua RolePermission) + permission gán trực tiếp (UserPermission)
    const rolePermissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.name),
    );
    const directPermissions = user.permissions.map((up) => up.permission.name);
    const allPermissions = [...new Set([...rolePermissions, ...directPermissions])];

    const payload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
      permissions: allPermissions,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, roles: roleNames },
    };
  }
}
