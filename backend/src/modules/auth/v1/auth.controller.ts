import { Body, Controller, Get, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { JwtPayload } from '@common/interfaces/jwt-payload.interface';
import { UsersService } from '@modules/users/users.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.findOne(user.sub);
  }
}
