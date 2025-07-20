import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditLessonDto } from 'src/dtos/lessons/edit.lesson.dto';
import { Lesson } from 'src/entities/lesson.entity';
import { ApiResponse } from 'src/misc/api.response.class';
import { Repository } from 'typeorm';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async add(lesson: Lesson): Promise<Lesson> {
    return this.lessonRepository.save(lesson);
  }

  async findByCourse(courseId: number): Promise<Lesson[]> {
    return this.lessonRepository.find({ where: { courseId }, order: { orderNumber: 'ASC' } });
  }

  async deleteById(lessonId: number): Promise<any> {
    return await this.lessonRepository.delete(lessonId);
  }

  async findOne(lessonId: number): Promise<Lesson | null> {
    return await this.lessonRepository.findOne({ where: { lessonId } });
  }

  async update(lessonId: number, editDto: EditLessonDto): Promise<Lesson | ApiResponse> {
    const lesson = await this.lessonRepository.findOne({ where: { lessonId } });
    if (!lesson) {
      return new ApiResponse('error', -404, 'Lekcija nije pronađena.');
    }

    Object.assign(lesson, editDto);
    return this.lessonRepository.save(lesson);
  }

  async deleteLessonByCourse(courseId: number, lessonId: number): Promise<ApiResponse> {
    const lesson = await this.lessonRepository.findOne({ where: { lessonId, courseId } });
    if (!lesson) {
      return new ApiResponse('error', -404, 'Lekcija nije pronađena za dati kurs.');
    }

    await this.lessonRepository.delete(lessonId);
    return new ApiResponse('ok', 0, 'Lekcija uspešno obrisana.');
  }
}
