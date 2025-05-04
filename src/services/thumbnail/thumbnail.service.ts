import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Course } from "src/entities/course.entity";
import { Thumbnail } from "src/entities/thumbnail.entity";
import { Repository } from "typeorm";

@Injectable()
export class ThumbnailService extends TypeOrmCrudService<Thumbnail> {
    constructor(
        @InjectRepository(Thumbnail)
        private readonly thumbnail: Repository<Thumbnail>
    ) {
        super(thumbnail)
    }

    add(newThumbnail: Thumbnail): Promise<Thumbnail> {
        return this.thumbnail.save(newThumbnail);
    }
}