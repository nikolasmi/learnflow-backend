import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiResponse } from "src/misc/api.response.class";
import { AdminService } from "src/services/admin/admin.service";
import * as crypto from 'crypto';
import * as jwt from "jsonwebtoken";
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { UserService } from "src/services/user/user.service";
import { LoginAdminDto } from "src/dtos/auth/login.admin.dto";
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import { LoginUserDto } from "src/dtos/auth/login.user.dto";
import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.dto";

@Controller('auth')
export class AuthController {
    constructor(
        public adminService: AdminService,
        public userService: UserService,
    ) { }

    @Post('admin/login')
    async doAdminLogin(@Body() data: LoginAdminDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const admin = await this.adminService.getByUsername(data.username)
        
        if(!admin) {
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -1004, "can not find admin"))
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(admin.password !== passwordHashString){
            return new Promise(resolve => resolve(new ApiResponse("error", -1004)))
        }

        //adminID, username,exp, ip, ua token(JWT)

        const jwtData = new JwtDataDto()
            jwtData.role = "admin";
            jwtData.id = admin.adminId;
            jwtData.identity = admin.username;

            jwtData.exp = this.getDatePlus(60 * 60 * 24 * 14);

            jwtData.ip = req.ip ?  req.ip.toString() : "null";
            jwtData.ua = req.headers["user-agent"] ? req.headers["user-agent"] : "null";

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            admin.adminId,
            admin.username,
            token,
            "",
            ""
        );

        return new Promise(resolve => resolve(responseObject))
    }

    @Post('user/register')
    async userRegister(@Body() data: AddUserDto) {
        return await this.userService.add(data)
    }

    @Post('user/login')
    async doUserLogin(@Body() data: LoginUserDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const user = await this.userService.getByEmail(data.email)
        
        if(!user) {
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -1004, "can not find user"))
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(user.password !== passwordHashString){
            return new Promise(resolve => resolve(new ApiResponse("error", -1004,"error creating user")))
        }

        const jwtData = new JwtDataDto()
            jwtData.role = "user";
            jwtData.id = user.userId;
            jwtData.identity = user.email;

            jwtData.exp = this.getDatePlus(60 * 60);

            jwtData.ip = req.ip ? req.ip.toString() : "null";
            jwtData.ua = req.headers["user-agent"] ? req.headers["user-agent"] : "null";

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const jwtRefreshData = new JwtRefreshDataDto()
        jwtRefreshData.id = jwt.userId
        jwtRefreshData.role = jwt.role
        jwtRefreshData.identity = jwt.identity
        jwtRefreshData.exp = this.getDatePlus(60 * 60 * 24 * 31)
        jwtRefreshData.ip = jwt.ip
        jwtRefreshData.ua = jwt.ua

        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret)

        const responseObject = new LoginInfoDto(
            user.userId,
            user.email,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp)
        );

        await this.userService.addToken(user.userId, refreshToken, this.getDatabaseDateFormat(this.getIsoDate(jwtRefreshData.exp)))

        return new Promise(resolve => resolve(responseObject))
    }

    private getDatePlus(numberOfSecunds: number) {
        return new Date().getTime() / 1000 + numberOfSecunds;
    }

    private getIsoDate(timestamp: number) {
        const date = new Date()
        date.setTime(timestamp * 1000)
        return date.toISOString()
    }

    private getDatabaseDateFormat(isoFormat: string): string {
        return isoFormat.substr(0,19).replace('T', ' ')
    }
}