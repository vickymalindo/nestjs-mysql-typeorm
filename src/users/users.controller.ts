import { CreateUserDto } from './CreateUser.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUsers() {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const { ...userDetails, confirmPassword } = createUserDto;
    this.userService.createUser(userDetails);
  }
}
