import { Injectable } from "@nestjs/common";
import { Course } from "src/entities/course.entity";
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/entities/user.entity";
import { Category } from "src/entities/category.entity";

@Injectable()
export class VideoService extends TypeOrmCrudService<Course> {
    constructor(
        @InjectRepository(Course) private readonly course: Repository<Course>,
        @InjectRepository(User) private readonly user: Repository<User>,
        @InjectRepository(Category) private readonly category: Repository<Category>,
    ){ super(course) }

    
}