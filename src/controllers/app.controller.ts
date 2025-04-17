import { Controller, Get } from '@nestjs/common';
import { User } from 'entities/user.entity';
import { UserService } from '../services/user/user.service';

@Controller()
export class AppController {

  constructor(
    private userService: UserService
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
