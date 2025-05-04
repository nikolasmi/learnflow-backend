import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { AddCommentDto } from "src/dtos/comment/add.comment.dto";
import { EditCommentDto } from "src/dtos/comment/edit.comment.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>
    ){}

    getAll(courseId: number): Promise<Comment[]> {
        return this.commentRepository.find({
          where: { courseId },
          relations: ['user', 'course'],
          order: { createdAt: 'DESC' },
        });
    }
    
    getById(id: number): Promise<Comment | null> {
        return this.commentRepository.findOne({
            where: { commentId: id },
            relations: ['user', 'course'],
        });
    }
    
    async add(data: AddCommentDto): Promise<Comment | ApiResponse> {
        const comment = this.commentRepository.create({
            userId: data.userId,
            courseId: data.courseId,
            comment: data.comment,
            rating: data.rating,
        });

        try {
          return await this.commentRepository.save(comment);
        } catch (err) {
          return new ApiResponse('error', -4001, 'Greška prilikom čuvanja komentara.');
        }
    }
    
    async edit(id: number, data: EditCommentDto): Promise<Comment | ApiResponse> {
        const comment = await this.commentRepository.findOne({ where: { commentId: id } });

        if (!comment) {
            return new ApiResponse('error', -4002, 'Komentar nije pronađen.');
        }

        if (data.comment) comment.comment = data.comment;
        if (data.rating) comment.rating = data.rating;

        try {
            return await this.commentRepository.save(comment);
        } catch (err) {
            return new ApiResponse('error', -4003, 'Greška prilikom izmene komentara.');
        }
    }

    async delete(id: number): Promise<ApiResponse> {
        const comment = await this.commentRepository.findOne({ where: { commentId: id } });

        if (!comment) {
            return new ApiResponse('error', -4004, 'Komentar nije pronađen.');
        }

        try {
            await this.commentRepository.remove(comment);
            return new ApiResponse('ok', 0, 'Komentar uspešno obrisan.');
        } catch (err) {
            return new ApiResponse('error', -4005, 'Greška prilikom brisanja komentara.');
        }
    }
}
