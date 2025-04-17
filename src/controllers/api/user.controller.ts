import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { User } from "entities/user.entity";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { EditUserDto } from "src/dtos/user/edit.user.dto";
import { UserService } from "src/services/user/user.service";

@Controller('api/user')
export class UserController {
    constructor (
        private userService: UserService
    ) {}

    @Get()
    getAll(): Promise<User[]> {
        return this.userService.getAll()
    }

    @Get(':id')
    getById(@Param('id') userId: number): Promise<User | null> {
        return this.userService.getById(userId)
    }

    @Post()
    add(@Body() data: AddUserDto): Promise<User> {
        return this.userService.add(data)
    }

    @Put(':id')
    edit(@Param('id') id: number, @Body() data: EditUserDto): Promise<User> {
        return this.userService.edit(id, data)
    }
}