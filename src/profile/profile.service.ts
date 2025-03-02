import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { ProfileParams } from 'src/utils/types.util';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private readonly logger: Logger,
  ) {}

  async createProfile(id: number, createProfileDetails: ProfileParams) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new HttpException(
          'User not found. Cannot create Profile',
          HttpStatus.NOT_FOUND,
        );
      }

      const newProfile = this.profileRepository.create(createProfileDetails);
      const savedProfile = await this.profileRepository.save(newProfile);
      user.profile = savedProfile;
      return this.userRepository.save(user);
    } catch (error) {
      this.logger.error('failed to create profile', error.stack, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(userId: number) {
    try {
      const profile = await this.profileRepository.findOne({
        relations: { user: true },
        where: {
          user: {
            id: userId,
          },
        },
      });

      if (!profile) {
        throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);
      }

      return profile;
    } catch (error) {
      this.logger.error('failed to get profile', error.stack, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(id: number, updateProfileDetails: ProfileParams) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id: id },
      });

      if (!profile) {
        throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);
      }

      const updatedProfile = await this.profileRepository.update(
        { id },
        { ...updateProfileDetails },
      );

      const { affected } = updatedProfile;
      if (!affected) {
        throw new HttpException(
          'failed update password',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {};
    } catch (error) {
      this.logger.error('failed to update profile', error.stack, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProfile(id: number) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id: id },
      });

      if (!profile) {
        throw new HttpException('Profile Not Found', HttpStatus.NOT_FOUND);
      }

      const deletedProfile = await this.profileRepository.delete({ id });

      const { affected } = deletedProfile;
      if (!affected) {
        throw new HttpException(
          'failed delete profile',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {};
    } catch (error) {
      this.logger.error('failed to delete profile', error.stack, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
