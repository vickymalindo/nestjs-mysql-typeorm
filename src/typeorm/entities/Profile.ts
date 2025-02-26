import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'user_profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastname: string;

  @Column()
  age: number;

  @Column({ type: 'date' })
  birthdate: string;

  // @Index()
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
