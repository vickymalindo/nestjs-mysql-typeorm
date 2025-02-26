import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ) {}

  async createProfile(id: number, createProfileDetails: ProfileParams) {
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
  }

  async getProfile(userId: number) {
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
  }

  async updateProfile(id: number, updateProfileDetails: ProfileParams) {
    const updatedProfile = await this.profileRepository.update(
      { id },
      { ...updateProfileDetails },
    );

    const { affected } = updatedProfile;
    if (!affected) {
      throw new HttpException('failed update password', HttpStatus.BAD_REQUEST);
    }

    return {};
  }

  async deleteProfile(id: number) {
    const deletedProfile = await this.profileRepository.delete({ id });

    console.log(deletedProfile);

    const { affected } = deletedProfile;
    if (!affected) {
      throw new HttpException('failed delete password', HttpStatus.BAD_REQUEST);
    }

    return {};
  }
}
