import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/Profile';
import { Post } from './typeorm/entities/Post';
import { AuthModule } from './auth/auth.module';
import { SecureHeaders } from './middleware/secureHeader.middleware';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { AppLogger } from './middleware/appLogger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs_mysql_typeorm',
      entities: [User, Profile, Post],
      // this for auto update table database
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PostModule,
    ProfileModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecureHeaders).forRoutes('*'),
      consumer.apply(AppLogger).forRoutes('*');
  }
}
