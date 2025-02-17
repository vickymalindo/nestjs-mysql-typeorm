import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// this entity called users or the table name is users
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  authStrategy: string;
}
