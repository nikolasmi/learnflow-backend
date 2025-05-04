import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AddCommentDto } from "src/dtos/comment/add.comment.dto";
import { EditCommentDto } from "src/dtos/comment/edit.comment.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Comment } from "src/entities/comment.entity";
import { CommentService } from "src/services/comment/comment.service";

@Controller('api/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @Get('course/:id')
    getByCourse(@Param('id') courseId: number): Promise<Comment[]> {
      return this.commentService.getAll(courseId);
    }
  
    @Get(':id')
    getById(@Param('id') id: number): Promise<Comment | null> {
      return this.commentService.getById(id);
    }
  
    @Post()
    add(@Body() data: AddCommentDto): Promise<Comment | ApiResponse> {
      return this.commentService.add(data);
    }
  
    @Put(':id')
    edit(@Param('id') id: number, @Body() data: EditCommentDto): Promise<Comment | ApiResponse> {
      return this.commentService.edit(id, data);
    }
  
    @Delete(':id')
    delete(@Param('id') id: number): Promise<ApiResponse> {
      return this.commentService.delete(id);
    }
}