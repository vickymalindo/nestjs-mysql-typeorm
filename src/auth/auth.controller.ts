import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  SetMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @SetMetadata('responseMessage', 'successfully logged in')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
