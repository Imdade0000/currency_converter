import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateWaitingListDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email to notify at launch' })
    @IsEmail()
    email: string;
}
