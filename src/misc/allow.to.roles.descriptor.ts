import { SetMetadata } from "@nestjs/common"

export const allowToRoles = (...roles: ("admin" | "user")[]) => {
    return SetMetadata('allow_to_roles', roles);
}