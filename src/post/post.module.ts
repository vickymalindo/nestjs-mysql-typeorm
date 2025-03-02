import { Logger, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Post } from 'src/typeorm/entities/Post';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  controllers: [PostController],
  providers: [PostService, Logger],
})
export class PostModule {}
