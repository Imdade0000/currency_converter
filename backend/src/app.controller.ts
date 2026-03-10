import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Public()
    @Get('health')
    @ApiOperation({ summary: 'Vérification de l\'état de santé de l\'API' })
    getHealth(): any {
        return this.appService.getHealth();
    }
}
