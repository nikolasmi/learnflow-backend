import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { Category } from "src/entities/category.entity";
import { AddCategoryDto } from "src/dtos/category/add.category.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import { EditCategoryDto } from "../../dtos/category/edit.category.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private readonly category: Repository<Category>
    ) { }

    getAll(): Promise<Category[]> {
        return this.category.find()
    }

    async getById(id: number): Promise<Category | ApiResponse> {
        const category = await this.category.findOne({where: {categoryId: id}})

        if (category === null) {
            return new ApiResponse("error", -3002, "Category not found")
        }

        return category
    }

    add(data: AddCategoryDto): Promise<Category | ApiResponse> {
        let newCategory: Category = new Category()
        newCategory.name = data.name

        return new Promise((resolve) => {
            this.category.save(newCategory).then(data => resolve(data)).catch(error => {
                const response: ApiResponse = new ApiResponse("error", -3001)
            });
        });
    }

    async edit(id: number, data: EditCategoryDto): Promise<Category | ApiResponse> {
        let category = await this.category.findOne({where: {categoryId: id}})
        
        if (!category) {
            return new ApiResponse("error", -3002)
        }

        if (data.name) category.name = data.name

        try {
            return await this.category.save(category)
        } catch (error) {
            return new ApiResponse("error", -3001)
        }
    }
}