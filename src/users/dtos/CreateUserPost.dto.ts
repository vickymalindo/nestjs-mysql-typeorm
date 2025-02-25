import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
