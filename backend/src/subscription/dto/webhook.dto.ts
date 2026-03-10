import { IsString } from 'class-validator';

export class WebhookDto {
    @IsString()
    signature: string;
}
