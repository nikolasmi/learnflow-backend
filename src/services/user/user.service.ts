import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import { EditUserDto } from 'src/dtos/user/edit.user.dto';
import { ApiResponse } from 'src/misc/api.response.class';
import { Repository } from 'typeorm';
import * as crypto from 'crypto'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly user: Repository<User>
    ) { }

    getAll(): Promise<User[]> {
        return this.user.find()
    }

    async getById(id: number): Promise<User | ApiResponse> {
        const user = await this.user.findOne({where: {userId: id}})

        if (user === null) {
            return new ApiResponse("error", -1002, "user nije pronadjen")
        }

        return user
    }

    async getByEmail(email: string): Promise<User | null> {
        const user = await this.user.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            return user;
        }

        return null
    }

    add(data: AddUserDto): Promise<User | ApiResponse> {
        const crypto = require('crypto')

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        let newUser: User = new User();
        newUser.name = data.name;
        newUser.email = data.email;
        newUser.password = passwordHashString;
        newUser.surname = data.surname;
        newUser.phone = data.phone;

        return new Promise((resolve) => {
            this.user.save(newUser).then(data => resolve(data))
            .catch(error => {
                const response: ApiResponse = new ApiResponse("error", -1001, "greska prilikom kreiranja usera");
                resolve(response)
            });
        });
    }

    async edit(id: number, data: EditUserDto): Promise<User | ApiResponse> {
        let user = await this.user.findOne({where: {userId: id}})

        if (user === undefined) {
            return new Promise((resolve) => {
                resolve(new ApiResponse("error", -1002, "user nije pronadjen"))
            })
        }

        if (!user) {
            return new Promise((resolve) => {
                resolve(new ApiResponse("error", -1002, "user nije pronadjen"))
            })
        }

        const crypto = require('crypto')
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        user.password = passwordHashString;

        return this.user.save(user)
    } 
}
