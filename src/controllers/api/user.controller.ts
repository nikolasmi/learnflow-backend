import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { EditUserDto } from "src/dtos/user/edit.user.dto";
import { ApiResponse } from "src/misc/api.response.class";
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
    getById(@Param('id') userId: number): Promise<User | ApiResponse> {
        return new Promise(async(resolve) => {
            let user = await this.userService.getById(userId)
            if (user === undefined) {
                resolve(new ApiResponse("error", -1002, "user nije pronadjen"))
            }

            resolve(user)
        });

    }

    @Post()
    add(@Body() data: AddUserDto): Promise<User | ApiResponse> {
        return this.userService.add(data)
    }

    @Put(':id')
    edit(@Param('id') id: number, @Body() data: EditUserDto): Promise<User | ApiResponse> {
        return this.userService.edit(id, data)
    }
}