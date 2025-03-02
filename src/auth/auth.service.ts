import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async login(params: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findUserByUsername(params.username);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(params.password, user.password);

      if (!isMatch) {
        throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        role: user.role,
      };

      const access_token = await this.jwtService.signAsync(payload);
      return { access_token: access_token };
    } catch (error) {
      this.logger.error('failed to login', error.stack, error);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
