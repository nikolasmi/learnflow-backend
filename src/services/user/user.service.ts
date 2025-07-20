import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import { EditUserPasswordDto } from 'src/dtos/user/edit.user.password.dto';
import { ApiResponse } from 'src/misc/api.response.class';
import { Repository } from 'typeorm';
import * as crypto from 'crypto'
import { UserToken } from 'src/entities/user-token.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { EditUserDetailsDto } from 'src/dtos/user/edit.user.details.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<User>{
    constructor(
        @InjectRepository(User) private readonly user: Repository<User>,
        @InjectRepository(UserToken) private readonly userToken: Repository<UserToken>
    ) {
        super(user);
     }

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

    async editDetails(id: number, data: EditUserDetailsDto): Promise<User | ApiResponse> {
        const user = await this.user.findOne({ where: { userId: id } })

        if (!user) {
            return new ApiResponse("error", -1002, "user nije pronadjen")
        }

        user.name = data.name
        user.surname = data.surname
        user.email = data.email
        user.phone = data.phone

        return this.user.save(user)
    }

    async editPassword(id: number, data: EditUserPasswordDto): Promise<User | ApiResponse> {
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

    async addToken(user_id: number, token: string, expiresAt: string) {
        const userToken = new UserToken()
        userToken.userId = user_id;
        userToken.token = token
        userToken.expiresAt = expiresAt

        return await this.userToken.save(userToken)
    }

    async getUserToken(token: string): Promise<UserToken | null> {
        return await this.userToken.findOne({where: {token: token}});
    }

    async invalidateToken(token: string): Promise<UserToken | ApiResponse> {
        const userToken = await this.userToken.findOne({ where: { token: token } });
    
        if (!userToken) {
            return new ApiResponse('Error', -10001, "Ne postoji takav token");
        }
    
        userToken.isValid = 0;
        await this.userToken.save(userToken);
    
        const updatedToken = await this.getUserToken(token);
        if (!updatedToken) {
            return new ApiResponse('Error', -10002, "Token nije validan nakon pokušaja deaktivacije");
        }
    
        return updatedToken;
    }
    
    async invalidateUserToken(userId: number): Promise<(UserToken | ApiResponse)[]> {
        const userTokens = await this.userToken.find({ where: { userId: userId } });
    
        const results: Promise<UserToken | ApiResponse>[] = [];
    
        for (const userToken of userTokens) {
            results.push(this.invalidateToken(userToken.token));
        }
    
        return await Promise.all(results);
    }    
}
