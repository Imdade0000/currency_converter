import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { GenerateKeyDto } from './dto/generate-key.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Clés API')
@Controller('api-keys')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApiKeysController {
    constructor(private readonly apiKeysService: ApiKeysService) { }

    @Post('generate')
    @ApiOperation({ summary: 'Générer une nouvelle clé API' })
    generate(@Request() req, @Body() generateKeyDto: GenerateKeyDto) {
        return this.apiKeysService.generateKey(req.user.id, generateKeyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister mes clés API' })
    findAll(@Request() req) {
        return this.apiKeysService.findAll(req.user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Révoquer une clé API' })
    revoke(@Request() req, @Param('id') id: string) {
        return this.apiKeysService.revoke(id, req.user.id);
    }
}
