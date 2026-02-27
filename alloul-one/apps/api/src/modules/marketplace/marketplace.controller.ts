import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { MarketplaceService } from './marketplace.service';

@ApiTags('marketplace')
@Controller('marketplace')
@UseGuards(JwtAuthGuard, RbacGuard)
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Permissions('marketplace.read')
  @Get('listings')
  list(@Query('type') type?: string) {
    return this.marketplace.listListings(type);
  }

  @Permissions('marketplace.write')
  @Post('listings')
  createListing(
    @Body() body: {
      ownerUserId: string;
      orgId?: string;
      type: 'SERVICE' | 'JOB' | 'REQUEST' | 'PRODUCT';
      title: string;
      description: string;
      price?: number;
      currency?: string;
    },
  ) {
    return this.marketplace.createListing(body);
  }

  @Permissions('marketplace.write')
  @Post('offers')
  createOffer(@Body() body: { listingId: string; bidderUserId: string; amount: number }) {
    return this.marketplace.createOffer(body);
  }

  @Permissions('marketplace.write')
  @Post('orders')
  createOrder(@Body() body: { listingId: string; buyerUserId: string; sellerUserId: string; amount: number }) {
    return this.marketplace.createOrder(body);
  }
}
