import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

class CreateAccessTokenDto {
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

export default CreateAccessTokenDto;
