import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async listListings(type?: string) {
    return this.prisma.marketplaceListing.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async createListing(input: {
    ownerUserId: string;
    orgId?: string;
    type: 'SERVICE' | 'JOB' | 'REQUEST' | 'PRODUCT';
    title: string;
    description: string;
    price?: number;
    currency?: string;
  }) {
    return this.prisma.marketplaceListing.create({
      data: {
        ownerUserId: input.ownerUserId,
        orgId: input.orgId,
        type: input.type,
        title: input.title,
        description: input.description,
        price: input.price,
        currency: input.currency || 'USD',
      },
    });
  }

  async createOffer(input: { listingId: string; bidderUserId: string; amount: number }) {
    return this.prisma.marketplaceOffer.create({
      data: { ...input, status: 'pending' },
    });
  }

  async createOrder(input: { listingId: string; buyerUserId: string; sellerUserId: string; amount: number }) {
    return this.prisma.marketplaceOrder.create({
      data: { ...input, status: 'created' },
    });
  }
}
