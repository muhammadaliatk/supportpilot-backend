import { MinLength, Matches } from 'class-validator';
import { RegisterUserDto } from '../../registration/dto/register-user.dto';

export class RegisterDto extends RegisterUserDto {
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
    {
      message:
        'Password must contain uppercase, lowercase, number and special character',
    },
  )
  declare password: string;
}