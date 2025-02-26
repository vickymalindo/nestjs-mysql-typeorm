import { CreateUserPostDto } from './dtos/CreateUserPost.dto';
import { CreateUserDto } from './dtos/CreateUser.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { Public } from 'src/decorator/public.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Get()
  @SetMetadata('responseMessage', 'successfully get users')
  getUsers() {
    return this.userService.findUsers();
  }

  @Public()
  @Post()
  @SetMetadata('responseMessage', 'successfully create user')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Public()
  @Put()
  @SetMetadata('responseMessage', 'successfully update password')
  async updatePassword(@Body(ValidationPipe) updatePasswordDto: UpdateUserDto) {
    const updatedPassword =
      await this.userService.updatePassword(updatePasswordDto);
    return updatedPassword;
  }

  @Delete()
  @UseGuards(RoleGuard)
  @Roles('admin')
  @SetMetadata('responseMessage', 'successfully delete user')
  async deleteUser(@Query('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @Post(':id/post')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createUserPostDto: CreateUserPostDto,
  ) {
    return this.userService.createUserPost(id, createUserPostDto);
  }
}
