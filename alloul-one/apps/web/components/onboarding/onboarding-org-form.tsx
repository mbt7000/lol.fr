export function OnboardingOrgForm() {
  return (
    <form className="grid gap-3 md:grid-cols-2">
      <input className="rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Organization name" />
      <input className="rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Slug" />
      <select className="rounded-lg border border-edge bg-black/20 px-3 py-2">
        <option>Arabic (ar)</option>
        <option>English (en)</option>
        <option>Chinese (zh)</option>
        <option>Korean (ko)</option>
      </select>
      <select className="rounded-lg border border-edge bg-black/20 px-3 py-2">
        <option>UTC</option>
        <option>Asia/Riyadh</option>
      </select>
      <button className="rounded-lg bg-neon px-4 py-2 md:col-span-2">Create Organization</button>
    </form>
  )
}
