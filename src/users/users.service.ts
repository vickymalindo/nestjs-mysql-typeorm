import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types.util';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly logger: Logger,
  ) {}

  async findUsers() {
    try {
      const users = await this.userRepository.find({
        relations: ['profile', 'posts'],
      });

      if (users.length === 0) {
        throw new HttpException('Users Not Found', HttpStatus.NOT_FOUND);
      }

      return users;
    } catch (error) {
      this.logger.error('failed to get user', error.stack, error);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          username: username,
        },
      });

      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      this.logger.error('failed to get user', error.stack, error);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(userDeails: CreateUserParams) {
    try {
      const hashedPassword = await bcrypt.hash(userDeails.password, 12);

      // user repository create is not a promise
      const newUser = this.userRepository.create({
        ...userDeails,
        password: hashedPassword,
        createdAt: new Date(),
      });

      // user repository save is a promise
      return this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error('failed to create user', error.stack, error);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(updateUserDetails: UpdateUserParams) {
    try {
      const username = updateUserDetails.username;
      const updatedUser = await this.userRepository.update(
        { username },
        { password: updateUserDetails.password },
      );

      const { affected } = updatedUser;
      if (!affected) {
        throw new HttpException(
          'failed update password',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {};
    } catch (error) {
      this.logger.error('failed to update user', error.stack, error);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findBy({ id });

      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      const deletedUser = await this.userRepository.delete({ id });

      const { affected } = deletedUser;
      if (!affected) {
        throw new HttpException('failed delete user', HttpStatus.BAD_REQUEST);
      }

      return {};
    } catch (error) {
      this.logger.error('failed to delete user', error.stack, error);
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
