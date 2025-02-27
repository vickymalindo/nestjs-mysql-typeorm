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
import { CreatePostDto } from 'src/post/dtos/CreatePost.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/decorator/public.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorator/role.decorator';

@Controller('post')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @SetMetadata('responseMessage', 'successfully insert post')
  createPost(
    @Req() req: Request,
    @Body(ValidationPipe) createPostDto: CreatePostDto,
  ) {
    const user = req['user'];

    return this.postService.createPost(user.id, createPostDto);
  }

  @Get()
  @Public()
  @SetMetadata('responseMessage', 'successfully get posts')
  getPosts(
    @Query('page', ParseIntPipe) page: number,
    @Query('per_page', ParseIntPipe) perPage: number,
  ) {
    return this.postService.getPosts(page, perPage);
  }

  @Put()
  @SetMetadata('responseMessage', 'successfully update post')
  updatePost(
    @Query('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePostDto: CreatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete()
  @UseGuards(RoleGuard)
  @Roles('admin')
  @SetMetadata('responseMessage', 'successfully delete post')
  async deleteProfile(@Query('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
