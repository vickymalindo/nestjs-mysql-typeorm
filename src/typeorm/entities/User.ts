import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './Profile';
import { Post } from './Post';
import { Exclude } from 'class-transformer';

// this entity called user and the table name is users
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_firstname')
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  authStrategy: string;

  @Column({ default: 'user' })
  role: string;

  @Index('idx_user_profile')
  @OneToOne(() => Profile, (profile) => profile.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user, {
    onDelete: 'CASCADE',
  })
  posts: Post[];
}
