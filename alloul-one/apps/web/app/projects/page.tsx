import { AppShell } from '@/components/layout/app-shell'
import { ProjectsConsole } from '@/components/projects/projects-console'

export default function ProjectsPage() {
  return (
    <AppShell title="Projects & Tasks">
      <ProjectsConsole />
    </AppShell>
  )
}
