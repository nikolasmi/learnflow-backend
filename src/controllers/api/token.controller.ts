import { Controller } from "@nestjs/common";
import { AdminService } from "src/services/admin/admin.service";

@Controller('token')
export class TokenController {
    constructor(
        private adminService: AdminService,
    ) {}
}