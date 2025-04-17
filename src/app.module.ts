import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { User } from 'entities/user.entity';
import { UserService } from './services/user/user.service';
import { Category } from 'entities/category.entity';
import { Course } from 'entities/course.entity';
import { Lesson } from 'entities/lesson.entity';
import { Purchase } from 'entities/purchase.entity';
import { Comment } from 'entities/comment.entity';
import { UserController } from './controllers/api/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [ User, Category, Comment, Course, Lesson, Purchase ]
    }),
    TypeOrmModule.forFeature([ User ])
  ],
  controllers: [AppController, UserController],
  providers: [UserService],
})
export class AppModule {}
