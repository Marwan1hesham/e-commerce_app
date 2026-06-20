import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  registerDecorator,
  Validate,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchKeys', async: false })
export class MatchKeys implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {

    return value === args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} do not match with ${args.constraints[0]}`;
  }
}
export function isMatch(
  constraints: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: MatchKeys,
    });
  };
}

export class CreateUserDto {
  @Length(3, 15)
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsInt()
  age: number;

  // @Validate(matchPassword)
  @ValidateIf((data) => {
    return Boolean(data.password);
  })
  @isMatch(['password'])
  confirmPassword: string;

  @Optional()
  @IsString()
  phone: string;
}
