import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { OrgsModule } from './orgs/orgs.module';
import { RbacModule } from './rbac/rbac.module';
import { AdminModule } from './admin/admin.module';
import { TenantMiddleware } from '../common/middleware/tenant.middleware';

@Module({
  imports: [AuthModule, OrgsModule, RbacModule, AdminModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
