import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Alertes')
@Controller('alerts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) { }

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle alerte' })
    create(@Request() req, @Body() createAlertDto: CreateAlertDto) {
        return this.alertsService.create(req.user.id, createAlertDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister toutes les alertes de l\'utilisateur' })
    findAll(@Request() req) {
        return this.alertsService.findAll(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir les détails d\'une alerte' })
    findOne(@Request() req, @Param('id') id: string) {
        return this.alertsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour une alerte' })
    update(@Request() req, @Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
        return this.alertsService.update(id, req.user.id, updateAlertDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une alerte' })
    remove(@Request() req, @Param('id') id: string) {
        return this.alertsService.remove(id, req.user.id);
    }
}
