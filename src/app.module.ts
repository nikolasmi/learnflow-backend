import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { User } from 'src/entities/user.entity';
import { UserService } from './services/user/user.service';
import { Category } from 'src/entities/category.entity';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Purchase } from 'src/entities/purchase.entity';
import { Comment } from 'src/entities/comment.entity';
import { Admin } from 'src/entities/admin.entity';
import { UserController } from './controllers/api/user.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AdminController } from './controllers/api/admin.controller';
import { AdminService } from './services/admin/admin.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { CommentController } from './controllers/api/comment.controller';
import { CommentService } from './services/comment/comment.service';
import { CourseController } from './controllers/api/course.controller';
import { CourseService } from './services/course/course.service';
import { Thumbnail } from './entities/thumbnail.entity';
import { ThumbnailService } from './services/thumbnail/thumbnail.service';
import { UserToken } from './entities/user-token.entity';
import { LessonService } from './services/lesson/lesson.service';
import { LessonController } from './controllers/api/lesson.controller';
import { UserDashboardController } from './controllers/api/user.dashboard.controller';
import { UserDashboardService } from './services/user/user.dashboard.service';
import { PurchaseController } from './controllers/api/purchase.controller';
import { PurchaseService } from './services/purchase/purchase.service';
import { Wishlist } from './entities/wishlist';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [ User, Admin, Category, Comment, Course, Lesson, Purchase, Thumbnail, UserToken, Wishlist ]
    }),
    TypeOrmModule.forFeature([ User, Admin, Category, Comment, Course, Thumbnail, UserToken, Lesson, Purchase, Wishlist ])
  ],
  controllers: [AppController, UserController, AuthController, AdminController, UserDashboardController, CategoryController, CommentController, CourseController, LessonController, PurchaseController],
  providers: [UserService, AdminService, CategoryService, CommentService, CourseService, UserDashboardService, ThumbnailService, LessonService, PurchaseService],
  exports: [AdminService, UserService, ThumbnailService, LessonService, UserDashboardService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude('auth/*')
    .exclude('api/*')
  }
}