import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OrgsModule } from './orgs/orgs.module';
import { RbacModule } from './rbac/rbac.module';
import { AdminModule } from './admin/admin.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { SearchModule } from './search/search.module';
import { AuditModule } from './audit/audit.module';
import { ProjectsModule } from './projects/projects.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { OutboxModule } from './outbox/outbox.module';
import { HandoverModule } from './handover/handover.module';
import { SocialModule } from './social/social.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { BillingModule } from './billing/billing.module';
import { UsageModule } from './usage/usage.module';
import { AiModule } from './ai/ai.module';
import { ObservabilityModule } from './observability/observability.module';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { SecurityMiddleware } from '../common/middleware/security.middleware';
import { RbacGuard } from '../common/guards/rbac.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, OrgsModule, RbacModule, AdminModule, KnowledgeModule, SearchModule, AuditModule, ProjectsModule, WorkflowsModule, OutboxModule, HandoverModule, SocialModule, MarketplaceModule, BillingModule, UsageModule, AiModule, ObservabilityModule],
  providers: [RbacGuard, JwtAuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware, TenantMiddleware).forRoutes('*');
  }
}
