import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userEmail = request.user?.email as string | undefined;

    if (!userEmail) {
      throw new ForbiddenException('Accès admin refusé');
    }

    const adminEmailsRaw = this.configService.get<string>('ADMIN_EMAILS') || '';
    const adminEmails = adminEmailsRaw
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(userEmail.toLowerCase())) {
      throw new ForbiddenException('Accès admin refusé');
    }

    return true;
  }
}
