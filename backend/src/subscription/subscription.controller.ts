import { Controller, Post, UseGuards, Request, RawBodyRequest, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Abonnements')
@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @UseGuards(JwtAuthGuard)
    @Post('create-checkout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Créer une session de paiement Stripe' })
    async createCheckout(@Request() req) {
        return this.subscriptionService.createCheckoutSession(req.user.id);
    }

    @Public()
    @Post('webhook')
    @ApiOperation({ summary: 'Point d\'entrée pour les webhooks Stripe' })
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Request() req: RawBodyRequest<any>,
    ) {
        return this.subscriptionService.handleWebhook(signature, req.rawBody);
    }
}
