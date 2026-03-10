import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHealth(): any {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            message: 'XChange API is up and running',
        };
    }
}
