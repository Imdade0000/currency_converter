import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
    private stripe: Stripe;
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('stripe.secretKey'), {
            apiVersion: '2023-10-16' as any,
        });
    }

    async createCheckoutSession(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: this.configService.get<string>('stripe.premiumPriceId'),
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${this.configService.get<string>('FRONTEND_URL')}/dashboard?success=true`,
            cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/premium?canceled=true`,
            client_reference_id: userId,
            customer_email: user.email,
        });

        return { sessionId: session.id, url: session.url };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error('Webhook Error');
        }

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                await this.handleSubscriptionSuccess(session);
                break;
            case 'customer.subscription.deleted':
                const subscription = event.data.object as Stripe.Subscription;
                await this.handleSubscriptionDeleted(subscription);
                break;
        }

        return { received: true };
    }

    private async handleSubscriptionSuccess(session: Stripe.Checkout.Session) {
        const userId = session.client_reference_id;
        const stripeCustomerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                isPremium: true,
                stripeCustomerId,
                subscriptionId,
            },
        });

        this.logger.log(`Subscription success for user ${userId}`);
    }

    private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
        await this.prisma.user.updateMany({
            where: { subscriptionId: subscription.id },
            data: {
                isPremium: false,
                subscriptionId: null,
            },
        });

        this.logger.log(`Subscription deleted: ${subscription.id}`);
    }
}
