import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParams,
  UpdateUserParams,
  CreateUserProfileParams,
  CreateUserPostParams,
} from 'src/utils/types.util';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async findUsers() {
    const users = await this.userRepository.find({
      relations: ['profile', 'posts'],
    });

    if (users.length === 0) {
      throw new HttpException('Users Not Found', HttpStatus.NOT_FOUND);
    }

    return users;
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(userDeails: CreateUserParams) {
    const hashedPassword = await bcrypt.hash(userDeails.password, 12);

    // user repository create is not a promise
    const newUser = this.userRepository.create({
      ...userDeails,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // user repository save is a promise
    return this.userRepository.save(newUser);
  }

  async updateUser(updateUserDetails: UpdateUserParams) {
    const username = updateUserDetails.username;
    const updatedUser = await this.userRepository.update(
      { username },
      { password: updateUserDetails.password },
    );

    const { affected } = updatedUser;
    if (!affected) {
      throw new HttpException('failed update password', HttpStatus.BAD_REQUEST);
    }

    return {};
  }

  async deleteUser(id: number) {
    const deletedUser = await this.userRepository.delete({ id });

    const { affected } = deletedUser;
    if (!affected) {
      throw new HttpException('failed update password', HttpStatus.BAD_REQUEST);
    }

    return {};
  }

  async createUserProfile(
    id: number,
    createUserProfileDetails: CreateUserProfileParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'User not found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newProfile = this.profileRepository.create(createUserProfileDetails);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userRepository.save(user);
  }

  async createUserPost(
    id: number,
    createUserPostDetails: CreateUserPostParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Post',
        HttpStatus.BAD_REQUEST,
      );
    const newPost = this.postRepository.create({
      ...createUserPostDetails,
      user,
    });
    return this.postRepository.save(newPost);
  }
}
