export class JwtRefreshDataDto {
    role: "admin" | "user"
    id: number;
    identity: string;
    exp: number; //unix time stamp
    ip: string;
    ua: string;

    toPlainObject() {
        return {
            role: this.role,
            id: this.id,
            identity: this.identity,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        }
    }
}