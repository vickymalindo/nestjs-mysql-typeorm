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
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @SetMetadata('responseMessage', 'successfully get users')
  getUsers() {
    return this.userService.findUsers();
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

  @UseGuards(AuthGuard)
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
