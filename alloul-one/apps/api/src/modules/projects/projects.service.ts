import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProjects(orgId: string) {
    return this.prisma.project.findMany({ where: { orgId }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createProject(input: { orgId: string; name: string; description?: string; dueDate?: string }) {
    return this.prisma.project.create({
      data: {
        orgId: input.orgId,
        name: input.name,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        status: 'active',
      },
    });
  }

  async listTasks(orgId: string, projectId?: string) {
    return this.prisma.task.findMany({
      where: { orgId, ...(projectId ? { projectId } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async createTask(input: {
    orgId: string;
    projectId: string;
    title: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) {
    return this.prisma.task.create({
      data: {
        orgId: input.orgId,
        projectId: input.projectId,
        title: input.title,
        status: 'todo',
        priority: input.priority,
        assigneeId: input.assigneeId,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      },
    });
  }
}
