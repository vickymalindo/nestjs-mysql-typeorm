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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppLogger } from './middleware/appLogger.middleware';
import { validate } from './config/env.validation';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Profile, Post],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PostModule,
    ProfileModule,
    ConfigModule.forRoot({ isGlobal: true, validate }),
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
