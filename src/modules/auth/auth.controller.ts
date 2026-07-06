import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './auth.service';
import { CreateUserDto, signInDto } from './dto/createUser.dto';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { TokenEnum } from 'src/common/enum/token.enum';
import { Auth, Roles, TokenType } from 'src/common/decorators/auth.decorator';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { RoleEnum } from 'src/common/enum/user.enum';
import { type HUserDoc } from 'src/DB/models/user.model';
import { User } from 'src/common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer.utils';
import { multer_enum, StoreEnum } from 'src/common/enum/multer.enum';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  signUp(@Body() body: CreateUserDto): object {
    return this.userService.signUp(body);
  }

  @Post('login')
  signIn(@Body() body: signInDto): object {
    return this.userService.signIn(body);
  }

  @Get('users')
  @Auth({ token_type: TokenEnum.access_token, access_roles: [RoleEnum.user] })
  getUsers(@Req() req: any) {
    return this.userService.getUsers();
  }

  @Get('profile')
  @TokenType()
  @UseGuards(AuthenticationGuard)
  getPrfile(@User() user: HUserDoc) {
    return { user };
  }

  @Post('profile')
  @UseInterceptors(
    FileInterceptor(
      'attachment',
      multerCloud({ custom_types: multer_enum.image }),
    ),
  )
  UploadedProfilePicture(@UploadedFile() file: Express.Multer.File) {
    return this.userService.UploadedProfilePicture(file);
  }
}
