import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { Admin } from 'entities/admin.entity';
import { UserController } from './controllers/api/user.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AdminController } from './controllers/api/admin.controller';
import { AdminService } from './services/admin/admin.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [ User, Admin, Category, Comment, Course, Lesson, Purchase ]
    }),
    TypeOrmModule.forFeature([ User, Admin, Category ])
  ],
  controllers: [AppController, UserController, AuthController, AdminController, CategoryController],
  providers: [UserService, AdminService, CategoryService],
  exports: [AdminService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude('auth/*')
    .exclude('api/*')
  }
}