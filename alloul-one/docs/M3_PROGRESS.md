# M3 Progress

Completed now:
- Projects module (list/create projects)
- Tasks module (list/create tasks)
- Workflow engine module (list/create workflows + run + logs)
- Outbox module for event-driven execution (`workflow.run.requested`)
- Worker processor for outbox polling and workflow run lifecycle updates
  - PENDING -> RUNNING -> SUCCESS
  - run logs emitted during execution
- Web pages added:
  - `/projects`
  - `/workflows`
- Sidebar and route middleware updated for M3 pages
- OpenAPI contracts updated for tasks/workflows run endpoints

M3 architecture alignment:
- Event-driven core implemented via DB outbox + worker execution loop
- Workflow triggers and action graph represented in JSON definition
