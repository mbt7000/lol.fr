import { AppShell } from '@/components/layout/app-shell'
import { KnowledgeConsole } from '@/components/knowledge/knowledge-console'

export default function KnowledgePage() {
  return (
    <AppShell title="Knowledge Base">
      <KnowledgeConsole />
    </AppShell>
  )
}
