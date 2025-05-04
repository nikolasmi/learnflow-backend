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
  
  @Controller('api/course')
  export class CourseController {
    constructor(
      private readonly courseService: CourseService,
      private readonly thumbnailService: ThumbnailService
    ) {}
  
    @Post()
    create(@Body() addDto: AddCourseDto) {
      return this.courseService.create(addDto);
    }

    // @Post(':id/upload-video')
    // @UseInterceptors(FileInterceptor('video', {
    //   storage: diskStorage({
    //     destination: StorageConfig.thumbnails,
    //     filename: (req, file, callback) => {
    //       const original = file.originalname;
    //       const normalized = original.replace(/\s+/g, '-');
    //       const datePart = new Date().toISOString().replace(/[-T:.Z]/g, '');
    //       const randomPart = Array(10).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    //       const fileName = `${datePart}-${randomPart}-${normalized}`;
    //       callback(null, fileName);
    //     }
    //   })
    // }))
    // async uploadVideo(
    //   @Param('id', ParseIntPipe) courseId: number,
    //   @UploadedFile() video
    // ) {
    //   const updatedCourse = await this.courseService.uploadVideo(courseId, video.filename);
    
    //   return {
    //     message: 'Video uspešno otpremljen i povezan sa kursom.',
    //     course: updatedCourse,
    //   };
    // }

    @Post(':id/upload-thumbnail')
    @UseInterceptors(FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: StorageConfig.thumbnailDetination,
        filename: (req, file, callback) => {
          let original: string = file.originalname;

          let normalized = original.replace(/\s+/g, '-');
          normalized = normalized.replace(/[^A-z0-9\.\-]/g, '')
          let sada = new Date();
          let datePart = '';
          datePart += sada.getFullYear();
          datePart += (sada.getMonth() + 1).toString();
          datePart += sada.getDate().toString();

          let randomPart: string = Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join('');

          let fileName = datePart + '-' + randomPart + '-' + normalized

          fileName = fileName.toLowerCase()

          callback(null, fileName);
        } 
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|png)$/)) {
          req.fileFilterError = 'Bad file extension'
          callback(null, false)
          return;
        }

        if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
          req.fileFilterError = 'Bad file content'
          callback(null, false)
          return;
        }

        callback(null, true)
      },
      limits: {
        files: 1,
        fileSize: StorageConfig.thumbnailMaxFileSize
      }
    }))
    async uploadThumbnail(@Param('id') courseId: number, @UploadedFile() thumbnail, @Req() req): Promise<ApiResponse | Thumbnail> {
      if (req.fileFilterError) {
        return new ApiResponse('error', -4002, req.fileFilterError)
      }

      if (!thumbnail) {
        return new ApiResponse('error', -4002, "file not uploaded")
      }

      const newThumbnail: Thumbnail = new Thumbnail();
      newThumbnail.courseId = courseId;
      newThumbnail.imagePath = thumbnail.filename
      
      const savedThumbnail = await this.thumbnailService.add(newThumbnail)
      if (!savedThumbnail) {
        return new ApiResponse('error', -4001, "failed to save thumbnail")
      }

      return savedThumbnail
    }
    
    @Get()
    findAll() {
      return this.courseService.findAll();
    }

    @Get('/popular')
    popular() {
      return this.courseService.popular()
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.courseService.findOne(id);
    }
  
    @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() editDto: EditCourseDto,
    ) {
      return this.courseService.update(id, editDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.courseService.remove(id);
    }
}
  