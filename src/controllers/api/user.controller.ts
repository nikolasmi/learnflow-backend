import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { EditUserPasswordDto } from "src/dtos/user/edit.user.password.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { UserService } from "src/services/user/user.service";
import { EditUserDetailsDto } from "src/dtos/user/edit.user.details.dto";

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

    @Put(':id/details')
    editDetails(@Param('id') id: number, @Body() data: EditUserDetailsDto): Promise<User | ApiResponse> {
        return this.userService.editDetails(id, data)
    }

    @Put(':id/password')
    editPassword(@Param('id') id: number, @Body() data: EditUserPasswordDto): Promise<User | ApiResponse> {
        return this.userService.editPassword(id, data)
    }
}