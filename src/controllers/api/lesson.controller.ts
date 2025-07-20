import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { StorageConfig } from "config/storage.config";
import { Lesson } from "src/entities/lesson.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { LessonService } from "src/services/lesson/lesson.service";
import * as fs from 'fs';
import * as fileType from 'file-type';
import { diskStorage } from 'multer';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('api/lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService,
    ) {}

    @Get(':lessonId')
    async getOneLesson(@Param('lessonId', ParseIntPipe) lessonId: number): Promise<Lesson | ApiResponse> {
        const lesson = await this.lessonService.findOne(lessonId);

        if (!lesson) {
            return new ApiResponse('error', -404, 'Lekcija nije pronađena.');
        }

        return lesson;
    }

    @Get(':id/lessons')
    async getLessonsByCourse(@Param('id', ParseIntPipe) courseId: number): Promise<Lesson[] | ApiResponse> {
        const lessons = await this.lessonService.findByCourse(courseId);

        if (!lessons || lessons.length === 0) {
            return new ApiResponse('ok', 0, 'Kurs trenutno nema nijednu lekciju.');
        }

        return lessons;
    }

    @Put(':lessonId/edit')
    @UseInterceptors(FileInterceptor('video', {
        storage: diskStorage({
            destination: (req, file, callback) => {
            const lessonId = req.params.lessonId;
            const folderPath = `${StorageConfig.lessonVideoDestination}lesson_${lessonId}/`;

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
    async editLesson(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @UploadedFile() video,
        @Body() body,
        @Req() req
    ): Promise<ApiResponse | Lesson> {
        if (req.fileFilterError) {
            return new ApiResponse('error', -4002, req.fileFilterError);
        }

        const lesson = await this.lessonService.findOne(lessonId);
        if (!lesson) {
            return new ApiResponse('error', -404, 'Lekcija nije pronađena.');
        }

        if (video) {
            const fileTypeResult = await fileType.fromFile(video.path);
            if (!fileTypeResult || !fileTypeResult.mime.includes('video')) {
            fs.unlinkSync(video.path);
            return new ApiResponse('error', -4002, 'Neispravan tip fajla');
            }

            // Obrisi stari fajl ako postoji
            if (lesson.videoUrl) {
            const oldPath = `${StorageConfig.lessonVideoDestination}${lesson.videoUrl}`;
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            }

            lesson.videoUrl = `lesson_${lessonId}/${video.filename}`;
        }

        lesson.title = body.title || lesson.title;
        lesson.description = body.description || lesson.description;
        lesson.orderNumber = body.orderNumber || lesson.orderNumber;

        return this.lessonService.add(lesson);
    }

    @Delete('/course/:courseId/delete-lesson/:lessonId')
    async deleteLesson(@Param('courseId', ParseIntPipe) courseId: number, @Param('lessonId', ParseIntPipe) lessonId: number,) {
        return this.lessonService.deleteLessonByCourse(courseId, lessonId);
    }
}