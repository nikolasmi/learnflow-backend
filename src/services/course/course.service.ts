import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { AddCourseDto } from 'src/dtos/course/add.course.dto';
import { EditCourseDto } from 'src/dtos/course/edit.course.dto';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(addCourseDto: AddCourseDto): Promise<Course> {
    const course = this.courseRepository.create(addCourseDto);
    return this.courseRepository.save(course);
  }

  async uploadVideo(courseId: number, videoFilename: string): Promise<Course> {
    const course = await this.findOne(courseId);
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({ relations: ['category', 'user', 'thumbnail'] });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { courseId: id },
      relations: ['category', 'user', 'lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, editDto: EditCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, editDto);
    return this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }

  async popular(): Promise<Course[]> {
    const courses = await this.courseRepository.find({
      relations: ['category', 'user'],
    });
    
    return courses.slice(0, 6);
  }

  async findByCategoryId(categoryId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: {
        category: { categoryId }
      },
      relations: ['category', 'user', 'thumbnail']
    });
  }

  async filterCourses(
    categoryId?: number,
    dateFrom?: Date,
    dateTo?: Date,
    maxPrice?: number
  ): Promise<Course[]> {
    const where: FindOptionsWhere<Course> = {};

    if (categoryId) {
      where.category = { categoryId };
    }

    if (dateFrom && dateTo) {
      where.createdAt = Between(dateFrom, dateTo);
    } else if (dateFrom) {
      where.createdAt = MoreThanOrEqual(dateFrom);
    } else if (dateTo) {
      where.createdAt = LessThanOrEqual(dateTo);
    }

    if (maxPrice) {
      where.price = LessThanOrEqual(maxPrice.toString());
    }

    return this.courseRepository.find({
      where,
      relations: ['category', 'user', 'thumbnail'],
    });
  }
}