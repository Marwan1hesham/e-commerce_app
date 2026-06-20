import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  signUp(@Body() body: CreateUserDto): object {
    return this.userService.signUp(body);
  }
}
