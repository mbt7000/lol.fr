export function AuthCard() {
  return (
    <div className="glass neon-border mx-auto w-full max-w-md rounded-2xl border border-edge p-6">
      <h2 className="mb-2 text-xl font-semibold">Sign in to Alloul One</h2>
      <p className="mb-4 text-sm text-slate-400">OIDC / OAuth2 / Passwordless</p>
      <div className="space-y-3">
        <input className="w-full rounded-lg border border-edge bg-black/20 px-3 py-2" placeholder="Email" />
        <button className="w-full rounded-lg bg-neon px-4 py-2">Continue with Email</button>
        <button className="w-full rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Continue with Google</button>
        <button className="w-full rounded-lg border border-cyan/40 px-4 py-2 text-cyan">Continue with Microsoft</button>
      </div>
    </div>
  )
}
