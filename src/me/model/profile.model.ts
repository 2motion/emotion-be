import { ApiProperty } from '@nestjs/swagger';

class ProfileModel {
  @ApiProperty({
    required: true,
  })
  public name: string;

  @ApiProperty({
    required: false,
  })
  public avatarImage?: string;
}

export default ProfileModel;
