import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class OrgsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.organization.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  }

  async create(input: { name: string; slug: string; locale?: string; timezone?: string }) {
    return this.prisma.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        locale: input.locale || 'en',
        timezone: input.timezone || 'UTC',
      },
    });
  }
}
