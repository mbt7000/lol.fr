import { AppShell } from '@/components/layout/app-shell'
import { OnboardingOrgForm } from '@/components/onboarding/onboarding-org-form'

export default function OnboardingPage() {
  return (
    <AppShell title="Organization Onboarding">
      <p className="mb-4 text-sm text-slate-400">Create your workspace with locale, timezone, and tenant slug.</p>
      <OnboardingOrgForm />
    </AppShell>
  )
}
