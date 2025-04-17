import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { AddUserDto } from 'src/dtos/user/add.user.dto';
import { EditUserDto } from 'src/dtos/user/edit.user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly user: Repository<User>
    ) { }

    getAll(): Promise<User[]> {
        return this.user.find()
    }

    getById(id: number): Promise<User | null> {
        return this.user.findOne({where: {userId: id}})
    }

    add(data: AddUserDto): Promise<User> {
        const crypto = require('crypto')

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        let newUser: User = new User();
        newUser.name = data.name;
        newUser.email = data.email;
        newUser.password = passwordHashString;

        return this.user.save(newUser)
    }

    async edit(id: number, data: EditUserDto): Promise<User> {
        let user = await this.user.findOne({where: {userId: id}})

        if (!user) {
            throw new Error(`Korisnik sa ID ${id} nije pronađen.`)
        }

        const crypto = require('crypto')
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        user.password = passwordHashString;

        return this.user.save(user)
    } 
}
