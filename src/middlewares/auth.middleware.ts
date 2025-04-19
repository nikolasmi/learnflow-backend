import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdminService } from "src/services/admin/admin.service";
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from "config/jwt.secret";
import { UserService } from "src/services/user/user.service";
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(public adminService: AdminService, public userService: UserService) { }
    
    async use(req: Request, res: Response, next: NextFunction) {
        
        if(!req.headers.authorization) {
            throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;

        const tokenParts = token.split(' ');
        if(tokenParts.length !== 2) {
            throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
        }

        const tokenString = tokenParts[1]

        let jwtData: JwtDataDto;
        try {
            jwtData = jwt.verify(tokenString, jwtSecret);
        } catch (e) {
            throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED); 
        }

        if(!jwtData) {
            throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ip !== req.ip?.toString()) {
            throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ua !== req.headers["user-agent"]) {
            throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.role === "admin") {
            const admin = await this.adminService.getById(jwtData.id);
            if (!admin) {
                throw new HttpException('admin not found', HttpStatus.UNAUTHORIZED);
            }
        } else if (jwtData.role === "user") {
            const user = await this.userService.getById(jwtData.id);
            if (!user) {
                throw new HttpException('user not found', HttpStatus.UNAUTHORIZED);
            }
        }

        const trenutniTimestamp = new Date().getTime() / 1000;
        if(trenutniTimestamp >= jwtData.exp) {
            throw new HttpException('token expired', HttpStatus.UNAUTHORIZED);
        }

        next();
    }
}