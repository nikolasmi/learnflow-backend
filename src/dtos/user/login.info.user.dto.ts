export class LoginInfoUserDto {
    userId: number;
    email: string;
    token: string;

    constructor(id: number, email: string, token: string) {
        this.userId = id;
        this.email = email;
        this.token = token;
    }
}