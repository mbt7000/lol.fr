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
import { TenantMiddleware } from '../common/middleware/tenant.middleware';
import { RbacGuard } from '../common/guards/rbac.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule, OrgsModule, RbacModule, AdminModule, KnowledgeModule, SearchModule, AuditModule, ProjectsModule, WorkflowsModule, OutboxModule, HandoverModule],
  providers: [RbacGuard, JwtAuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
