import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import UserRepository from 'src/DB/repositories/user.repository';
import { CreateUserDto, signInDto } from './dto/createUser.dto';
import { User, UserModel } from 'src/DB/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Compare, Hash } from 'src/common/utils/security/hash';
import { encrypt } from 'src/common/utils/security/encrypt';
import { eventEmitter } from 'src/common/utils/email/email.events';
import { emailEnum, RoleEnum } from 'src/common/enum/user.enum';
import { generateOtp, sendEmail } from 'src/common/utils/email/send.email';
import { emailTemplate } from 'src/common/utils/email/email.template';
import { RedisService } from 'src/common/services/redis.service';
import { randomUUID } from 'node:crypto';
import TokenService from 'src/common/services/token.service';
import { S3Service } from 'src/common/services/s3.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
    private readonly s3Service: S3Service,
  ) {}

  async signUp(body: CreateUserDto) {
    const { phone, userName, age, email, password, confirmPassword } = body;

    if (await this.userRepo.findOne({ filter: { email } })) {
      throw new ConflictException('Email already exists');
    }

    const otp = await generateOtp();
    eventEmitter.emit(emailEnum.confirmEmail, async () => {
      await sendEmail({
        to: email,
        subject: 'email confirmation',
        html: emailTemplate(otp),
      });

      await this.redisService.setValue({
        key: this.redisService.otp_key({
          email,
          subject: emailEnum.confirmEmail,
        }),
        value: Hash({ plainText: `${otp}` }),
        ttl: 60 * 3,
      });

      await this.redisService.setValue({
        key: this.redisService.max_otp_key({
          email,
          subject: emailEnum.confirmEmail,
        }),
        value: '1',
        ttl: 60 * 3,
      });
    });

    const user = await this.userRepo.create({
      userName,
      email,
      password,
      age,
      phone: encrypt(phone),
    });

    return user;
  }

  async signIn(body: signInDto) {
    const { email, password }: signInDto = body;

    const user = await this.userRepo.findOne({ filter: { email } });

    if (!user) {
      throw new BadRequestException('invalid email or password');
    }

    if (!Compare({ plainText: password, cipherText: user.password })) {
      throw new BadRequestException('invalid email or password');
    }

    const uuid = randomUUID();

    const access_token = await this.tokenService.generateToken({
      payload: { id: user._id, email: user.email },
      options: {
        secret:
          user?.role == RoleEnum.user
            ? process.env.ACCESS_SECRET_KEY_USER
            : process.env.ACCESS_SECRET_KEY_ADMIN,
        expiresIn: 60 * 30,
        jwtid: uuid,
      },
    });

    const refresh_token = await this.tokenService.generateToken({
      payload: { id: user._id, email: user.email },
      options: {
        secret:
          user?.role == RoleEnum.user
            ? process.env.REFRESH_SECRET_KEY_USER
            : process.env.REFRESH_SECRET_KEY_ADMIN,
        expiresIn: '1y',
        jwtid: uuid,
      },
    });

    return { access_token, refresh_token };
  }

  async getUsers() {
    const users = await this.userRepo.find();

    return users;
  }

  async UploadedProfilePicture(file: Express.Multer.File) {
    return this.s3Service.uploadFile({
      file,
      path: `users`,
    });
  }
}
