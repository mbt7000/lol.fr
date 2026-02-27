import { AppShell } from '@/components/layout/app-shell'
import { MarketplaceConsole } from '@/components/marketplace/marketplace-console'

export default function MarketplacePage() {
  return (
    <AppShell title="Marketplace">
      <MarketplaceConsole />
    </AppShell>
  )
}
