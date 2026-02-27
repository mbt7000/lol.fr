import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('orgs/:orgId')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Permissions('project.read')
  @Get('projects')
  listProjects(@Param('orgId') orgId: string) {
    return this.projects.listProjects(orgId);
  }

  @Permissions('project.write')
  @Post('projects')
  createProject(
    @Param('orgId') orgId: string,
    @Body() body: { name: string; description?: string; dueDate?: string },
  ) {
    return this.projects.createProject({ orgId, ...body });
  }

  @Permissions('task.read')
  @Get('tasks')
  listTasks(@Param('orgId') orgId: string, @Query('projectId') projectId?: string) {
    return this.projects.listTasks(orgId, projectId);
  }

  @Permissions('task.write')
  @Post('tasks')
  createTask(
    @Param('orgId') orgId: string,
    @Body() body: { projectId: string; title: string; priority?: string; assigneeId?: string; dueDate?: string },
  ) {
    return this.projects.createTask({ orgId, ...body });
  }
}
