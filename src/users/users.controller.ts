import { CreateUserPostDto } from './dtos/CreateUserPost.dto';
import { CreateUserDto } from './dtos/CreateUser.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  SetMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { CreateUserProfileDto } from './dtos/CreateUserProfile.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @SetMetadata('responseMessage', 'successfully get users')
  getUsers() {
    return this.userService.findUser();
  }

  @Post()
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
  }

  @Post(':id/profile')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.userService.createUserProfile(id, createUserProfileDto);
  }

  @Post(':id/post')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserPostDto: CreateUserPostDto,
  ) {
    return this.userService.createUserPost(id, createUserPostDto);
  }
}
