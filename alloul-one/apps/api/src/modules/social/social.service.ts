import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async listFeed() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reactions: true, author: true },
      take: 50,
    });
  }

  async createPost(input: { authorId: string; content: string; visibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE' }) {
    return this.prisma.post.create({
      data: {
        authorId: input.authorId,
        content: input.content,
        visibility: input.visibility || 'PUBLIC',
      },
    });
  }

  async react(input: { postId: string; userId: string; type: string }) {
    return this.prisma.reaction.upsert({
      where: { postId_userId_type: { postId: input.postId, userId: input.userId, type: input.type } },
      create: input,
      update: {},
    });
  }

  async follow(input: { followerId: string; followeeId: string }) {
    return this.prisma.follow.upsert({
      where: { followerId_followeeId: input },
      create: input,
      update: {},
    });
  }

  async profile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const posts = await this.prisma.post.findMany({ where: { authorId: userId }, orderBy: { createdAt: 'desc' }, take: 20 });
    const followers = await this.prisma.follow.count({ where: { followeeId: userId } });
    const following = await this.prisma.follow.count({ where: { followerId: userId } });
    return { user, posts, followers, following };
  }

  async listGroups() {
    return this.prisma.group.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createGroup(input: { name: string; description?: string }) {
    return this.prisma.group.create({ data: input });
  }
}
