import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function tick() {
  const events = await prisma.eventOutbox.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    take: 20,
  })

  for (const event of events) {
    if (event.topic === 'workflow.run.requested') {
      const payload = event.payload as any
      const runId = payload?.runId as string

      if (runId) {
        await prisma.workflowRun.update({ where: { id: runId }, data: { status: 'RUNNING', startedAt: new Date() } })
        await prisma.workflowLog.create({ data: { runId, level: 'info', message: 'Workflow started by worker' } })

        // Simulated workflow execution (M3 scaffold)
        await prisma.workflowLog.create({ data: { runId, level: 'info', message: 'Executing trigger/action graph...' } })
        await prisma.workflowRun.update({ where: { id: runId }, data: { status: 'SUCCESS', endedAt: new Date(), output: { ok: true } as any } })
        await prisma.workflowLog.create({ data: { runId, level: 'info', message: 'Workflow completed successfully' } })
      }
    }

    await prisma.eventOutbox.update({
      where: { id: event.id },
      data: { status: 'PROCESSED', processedAt: new Date() },
    })
  }
}

console.log('Alloul One worker started: polling outbox every 3s')
setInterval(() => {
  tick().catch((err) => console.error('worker_error', err))
}, 3000)
