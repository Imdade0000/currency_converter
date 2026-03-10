import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from '../api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private apiKeysService: ApiKeysService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = request.headers['x-api-key'];

        if (!key) {
            throw new UnauthorizedException('Clé API manquante dans les headers (X-API-Key)');
        }

        const apiKey = await this.apiKeysService.validateKey(key as string);

        // Attach apiKey info to request for later use (logging)
        request.apiKey = apiKey;

        return true;
    }
}
