import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { ProfileDto } from './dtos/CreateProfile.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorator/role.decorator';

@Controller('profile')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @SetMetadata('responseMessage', 'successfully create profile')
  async createProfile(
    @Req() req: Request,
    @Body(ValidationPipe) createProfileDto: ProfileDto,
  ) {
    const user = req['user'];

    return this.profileService.createProfile(user.id, createProfileDto);
  }

  @Get()
  @SetMetadata('responseMessage', 'successfully get profile')
  async getProfile(@Req() req: Request) {
    const user = req['user'];

    return this.profileService.getProfile(user.id);
  }

  @Put()
  @SetMetadata('responseMessage', 'successfully update profile')
  async updateProfile(
    @Req() req: Request,
    @Body(ValidationPipe) updateProfileDto: ProfileDto,
  ) {
    const user = req['user'];

    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  @Delete()
  @UseGuards(RoleGuard)
  @Roles('admin')
  @SetMetadata('responseMessage', 'successfully delete profile')
  async deleteProfile(@Query('id', ParseIntPipe) id: number) {
    return this.profileService.deleteProfile(id);
  }
}
