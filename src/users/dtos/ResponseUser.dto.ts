import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: number;

  username: string;

  @Exclude()
  password: string;

  createdAt: Date;
  authStrategy: string | null;
  role: string;

  profile: ProfileResponseDto | null;
  posts: PostResponseDto[];
}

export class ProfileResponseDto {
  id: number;

  firstName: string;

  lastname: string;

  age: number;

  birthdate: string;
}

export class PostResponseDto {
  id: number;

  title: string;

  description: string;
}
