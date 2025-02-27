import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { User } from 'src/typeorm/entities/User';
import { PostParams } from 'src/utils/types.util';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getPosts(page: number, perPage: number) {
    const count = await this.postRepository.count();
    let pageCount = Math.ceil(count / perPage);

    if (page > pageCount) {
      page = pageCount;
    }

    const skip = perPage * (page - 1);

    let res = {};

    const posts = await this.postRepository.find({
      relations: { user: true },
      take: perPage,
      skip,
    });

    if (posts.length === 0) {
      throw new HttpException('empty posts', HttpStatus.NOT_FOUND);
    }

    res['posts'] = posts;
    res['page'] = page;
    res['page_count'] = pageCount;
    res['per_page'] = perPage;
    res['total'] = count;

    return res;
  }

  async createPost(id: number, createPostDetails: PostParams) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Post',
        HttpStatus.BAD_REQUEST,
      );

    const post = this.postRepository.create({
      ...createPostDetails,
      user,
    });

    if (!post) {
      throw new HttpException('Failed to create post', HttpStatus.NOT_FOUND);
    }

    return this.postRepository.save(post);
  }

  async updatePost(id: number, updatePostDetail: PostParams) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new HttpException('Post doesnt exist', HttpStatus.NOT_FOUND);
    }

    const updatedPost = await this.postRepository.update(id, updatePostDetail);

    const { affected } = updatedPost;

    if (!affected) {
      throw new HttpException('Update post failed', HttpStatus.BAD_REQUEST);
    }

    return {};
  }
}
