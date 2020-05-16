import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

class SignUpDto {
  @IsNotEmpty()
  public name: string;

  @IsPhoneNumber('KR')
  @IsOptional()
  public phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public password: string;
}

export default SignUpDto;
