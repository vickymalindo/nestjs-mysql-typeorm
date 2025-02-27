import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from 'src/post/dtos/CreatePost.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/decorator/public.decorator';

@Controller('post')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(
    @Req() req: Request,
    @Body(ValidationPipe) createPostDto: CreatePostDto,
  ) {
    const user = req['user'];

    return this.postService.createPost(user.id, createPostDto);
  }

  @Get()
  @Public()
  getPosts(
    @Query('page', ParseIntPipe) page: number,
    @Query('per_page', ParseIntPipe) perPage: number,
  ) {
    return this.postService.getPosts(page, perPage);
  }
}
