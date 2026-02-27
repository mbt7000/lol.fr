import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { SocialService } from './social.service';

@ApiTags('social')
@Controller()
@UseGuards(JwtAuthGuard, RbacGuard)
export class SocialController {
  constructor(private readonly social: SocialService) {}

  @Permissions('social.read')
  @Get('feed/posts')
  feed() {
    return this.social.listFeed();
  }

  @Permissions('social.write')
  @Post('feed/posts')
  post(@Body() body: { authorId: string; content: string; visibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE' }) {
    return this.social.createPost(body);
  }

  @Permissions('social.write')
  @Post('feed/posts/:postId/reactions')
  react(@Param('postId') postId: string, @Body() body: { userId: string; type: string }) {
    return this.social.react({ postId, ...body });
  }

  @Permissions('social.write')
  @Post('social/follow')
  follow(@Body() body: { followerId: string; followeeId: string }) {
    return this.social.follow(body);
  }

  @Permissions('social.read')
  @Get('social/profiles/:userId')
  profile(@Param('userId') userId: string) {
    return this.social.profile(userId);
  }

  @Permissions('social.read')
  @Get('social/groups')
  groups() {
    return this.social.listGroups();
  }

  @Permissions('social.write')
  @Post('social/groups')
  createGroup(@Body() body: { name: string; description?: string }) {
    return this.social.createGroup(body);
  }
}
