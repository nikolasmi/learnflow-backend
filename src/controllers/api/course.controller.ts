import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageConfig } from 'config/storage.config';
import { AddCourseDto } from 'src/dtos/course/add.course.dto';
import { EditCourseDto } from 'src/dtos/course/edit.course.dto';
import { CourseService } from 'src/services/course/course.service';
import { diskStorage } from 'multer';
import { ThumbnailService } from 'src/services/thumbnail/thumbnail.service';
import { Thumbnail } from 'src/entities/thumbnail.entity';
import { ApiResponse } from 'src/misc/api.response.class';
import * as fileType from 'file-type';
import * as fs from 'fs';
import { LessonService } from 'src/services/lesson/lesson.service';
import { Lesson } from 'src/entities/lesson.entity';

@Controller('api/course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly thumbnailService: ThumbnailService,
    private readonly lessonService: LessonService,
  ) {}

  @Post()
  create(@Body() addDto: AddCourseDto) {
    return this.courseService.create(addDto);
  }

  @Post(':id/upload-thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const courseId = req.params.id;
        const folderPath = `${StorageConfig.thumbnailDestination}course_${courseId}/`;

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        callback(null, folderPath);
      },
      filename: (req, file, callback) => {
        const original = file.originalname.replace(/\s+/g, '-').replace(/[^A-z0-9\.\-]/g, '');
        const now = new Date();
        const datePart = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
        const randomPart = Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join('');
        const fileName = `${datePart}-${randomPart}-${original}`.toLowerCase();
        callback(null, fileName);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|png)$/)) {
        req.fileFilterError = 'Bad file extension';
        return callback(null, false);
      }

      if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
        req.fileFilterError = 'Bad file content';
        return callback(null, false);
      }

      callback(null, true);
    },
    limits: {
      files: 1,
      fileSize: StorageConfig.thumbnailMaxFileSize,
    },
  }))
  async uploadThumbnail(
    @Param('id', ParseIntPipe) courseId: number,
    @UploadedFile() thumbnail,
    @Req() req,
  ): Promise<ApiResponse | Thumbnail> {
    if (req.fileFilterError) {
      return new ApiResponse('error', -4002, req.fileFilterError);
    }

    if (!thumbnail) {
      return new ApiResponse('error', -4002, 'file not uploaded');
    }

    const fileTypeResult = await fileType.fromFile(thumbnail.path);
    if (!fileTypeResult || !(fileTypeResult.mime.includes('jpeg') || fileTypeResult.mime.includes('png'))) {
      fs.unlinkSync(thumbnail.path);
      return new ApiResponse('error', -4002, 'bad file content type');
    }

    const newThumbnail = new Thumbnail();
    newThumbnail.courseId = courseId;
    newThumbnail.imagePath = `course_${courseId}/${thumbnail.filename}`;

    const savedThumbnail = await this.thumbnailService.add(newThumbnail);
    if (!savedThumbnail) {
      return new ApiResponse('error', -4001, 'failed to save thumbnail');
    }

    // 🔧 Ovde ažuriramo Course sa thumbnailId
    await this.courseService.update(courseId, {
      thumbnailId: savedThumbnail.thumbnailId,
    });

    return savedThumbnail;
  }

  @Post(':id/upload-lesson')
  @UseInterceptors(FileInterceptor('video', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const courseId = req.params.id;
        const folderPath = `${StorageConfig.lessonVideoDestination}course_${courseId}/`;

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        callback(null, folderPath);
      },
      filename: (req, file, callback) => {
        const original = file.originalname.replace(/\s+/g, '-').replace(/[^A-z0-9\.\-]/g, '');
        const now = new Date();
        const datePart = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
        const randomPart = Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join('');
        const fileName = `${datePart}-${randomPart}-${original}`.toLowerCase();
        callback(null, fileName);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(mp4|mov|avi)$/)) {
        req.fileFilterError = 'Bad file extension';
        return callback(null, false);
      }

      if (!file.mimetype.includes('video')) {
        req.fileFilterError = 'Bad file content';
        return callback(null, false);
      }

      callback(null, true);
    },
    limits: {
      files: 1,
      fileSize: StorageConfig.lessonVideoMaxFileSize,
    },
  }))
  async uploadLesson(
    @Param('id') courseId: number,
    @UploadedFile() video,
    @Body() body,
    @Req() req,
  ): Promise<ApiResponse | Lesson> {
    if (req.fileFilterError) {
      return new ApiResponse('error', -4002, req.fileFilterError);
    }

    if (!video) {
      return new ApiResponse('error', -4002, 'Video fajl nije otpremljen');
    }

    const fileTypeResult = await fileType.fromFile(video.path);
    if (!fileTypeResult || !fileTypeResult.mime.includes('video')) {
      fs.unlinkSync(video.path);
      return new ApiResponse('error', -4002, 'Neispravan tip fajla');
    }

    const lesson = new Lesson();
    lesson.courseId = courseId;
    lesson.title = body.title || 'Neimenovana lekcija';
    lesson.orderNumber = body.orderNumber || 1;
    lesson.videoUrl = `course_${courseId}/${video.filename}`;
    lesson.description = body.description || "bez opisa";

    return await this.lessonService.add(lesson);
  }

  @Delete(':courseId/deleteLesson/:lessonId')
  async deleteLesson(@Param('courseId') courseId: number, @Param('lessonId') lessonId: number) {
    const lesson = await this.lessonService.findOne(lessonId);

    if (!lesson || lesson.courseId !== courseId) {
      return new ApiResponse('error', -4004, 'Lekcija nije pronađena');
    }

    try {
      fs.unlinkSync(`${StorageConfig.lessonVideoDestination}${lesson.videoUrl}`);
    } catch {}

    const result = await this.lessonService.deleteById(lessonId);
    if (result.affected === 0) {
      return new ApiResponse('error', -4004, 'Brisanje nije uspelo');
    }

    return new ApiResponse('ok', 0, 'Lekcija je uspešno obrisana');
  }

  @Delete(':courseId/deleteThumbnail/:thumbnailId')
  async deleteThumbnail(@Param('courseId') courseId: number, @Param('thumbnailId') thumbnailId: number) {
    const thumbnail = await this.thumbnailService.findOne({
      where: { courseId, thumbnailId },
    });

    if (!thumbnail) {
      return new ApiResponse('error', -4004, 'thumbnail not found');
    }

    try {
      fs.unlinkSync(`${StorageConfig.thumbnailDestination}${thumbnail.imagePath}`);
    } catch {}

    const deleteResult = await this.thumbnailService.deleteById(thumbnailId);
    if (deleteResult.affected === 0) {
      return new ApiResponse('error', -4004, 'thumbnail not found');
    }

    return new ApiResponse('ok', 0, 'Thumbnail deleted');
  }

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.courseService.findByCategoryId(Number(categoryId));
    }
    return this.courseService.findAll();
  }

  @Get('/popular')
  popular() {
    return this.courseService.popular();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() editDto: EditCourseDto) {
    return this.courseService.update(id, editDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(id);
  }
}