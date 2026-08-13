import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTicketCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string;
}
