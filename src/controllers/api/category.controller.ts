import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Category } from "src/entities/category.entity";
import { AddCategoryDto } from "src/dtos/category/add.category.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { CategoryService } from "src/services/category/category.service";
import { EditCategoryDto } from "src/dtos/category/edit.category.dto";

@Controller('api/category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Get()
    getAll(): Promise<Category[] | ApiResponse> {
        return this.categoryService.getAll()
    }

    @Get(':id')
    getById(@Param('id') categoryId: number): Promise<Category | ApiResponse> {
        return new Promise(async (resolve) => {
            let category = await this.categoryService.getById(categoryId)
            if (category === null) {
                resolve(new ApiResponse("error", -3002, "could not find category"))
            }
            resolve(category)
        })
    }

    @Post()
    add(@Body() data: AddCategoryDto): Promise<Category | ApiResponse> {
        return this.categoryService.add(data)
    }

    @Put(':id')
    edit(@Param('id') categoryId: number, @Body() data: EditCategoryDto): Promise<Category | ApiResponse> {
        return this.categoryService.edit(categoryId, data)
    }

}