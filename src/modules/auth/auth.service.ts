import { ConflictException, Injectable } from '@nestjs/common';
import UserRepository from 'src/DB/repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserModel } from 'src/DB/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hash } from 'src/common/utils/security/hash';
import { encrypt } from 'src/common/utils/security/encrypt';
import { eventEmitter } from 'src/common/utils/email/email.events';
import { emailEnum } from 'src/common/enum/user.enum';
import { generateOtp, sendEmail } from 'src/common/utils/email/send.email';
import { emailTemplate } from 'src/common/utils/email/email.template';
import { RedisService } from 'src/common/services/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redisService: RedisService,
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
}
