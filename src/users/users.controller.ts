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
  SetMetadata,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { CreateUserProfileDto } from './dtos/CreateUserProfile.dto';
import { Public } from 'src/decorator/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

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
  async updateUser(@Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(updateUserDto);
    return updatedUser;
  }

  @Delete(':id')
  @SetMetadata('responseMessage', 'successfully delete user')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @Post(':id/profile')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.userService.createUserProfile(id, createUserProfileDto);
  }

  @Post(':id/post')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createUserPostDto: CreateUserPostDto,
  ) {
    return this.userService.createUserPost(id, createUserPostDto);
  }
}
