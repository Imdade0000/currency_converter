import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConversionService } from './conversion.service';
import { ConvertDto } from './dto/convert.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Conversion')
@Controller('conversion')
export class ConversionController {
    constructor(private conversionService: ConversionService) { }

    @Public()
    @Post('convert')
    @ApiOperation({ summary: 'Convertir un montant entre deux devises' })
    async convert(@Body() convertDto: ConvertDto, @Request() req) {
        const userId = req.user?.id || null;
        return this.conversionService.convert(convertDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('history')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtenir l\'historique des conversions de l\'utilisateur' })
    async getHistory(@Request() req, @Query('limit') limit: string = '10') {
        return this.conversionService.getConversionHistory(req.user.id, parseInt(limit, 10));
    }

    @Public()
    @Get('popular')
    @ApiOperation({ summary: 'Obtenir les conversions les plus populaires' })
    async getPopular() {
        return this.conversionService.getPopularConversions();
    }
}
