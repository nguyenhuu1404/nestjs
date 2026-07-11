import {
    Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe,
    UseGuards, HttpCode, HttpStatus,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
  import { PermissionsGuard } from '@common/guards/permissions.guard';
  import { RequirePermissions } from '@common/decorators/permissions.decorator';
  import { RolesService } from '../roles.service';
  import { CreateRoleDto } from './dto/create-role.dto';
  import { UpdateRoleDto } from './dto/update-role.dto';
  
  @Controller({ path: 'roles', version: '1' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  export class RolesController {
    constructor(private rolesService: RolesService) {}
  
    @Get()
    @RequirePermissions('roles.manage')
    findAll() {
      return this.rolesService.findAll();
    }
  
    @Get(':id')
    @RequirePermissions('roles.manage')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.rolesService.findOne(id);
    }
  
    @Post()
    @RequirePermissions('roles.manage')
    create(@Body() dto: CreateRoleDto) {
      return this.rolesService.create(dto);
    }
  
    @Patch(':id')
    @RequirePermissions('roles.manage')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
      return this.rolesService.update(id, dto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @RequirePermissions('roles.manage')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.rolesService.remove(id);
    }
  }
