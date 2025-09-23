import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class NotificationDto {
  @IsUUID()
  @IsOptional()
  messageID?: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
