export function LanguageSwitcher() {
  return (
    <form action="/locale" method="post" className="inline-flex items-center gap-2">
      <select name="locale" className="rounded-md border border-edge bg-black/20 px-2 py-1 text-xs">
        <option value="ar">AR</option>
        <option value="en">EN</option>
        <option value="zh">ZH</option>
        <option value="ko">KO</option>
      </select>
      <button className="rounded-md border border-cyan/40 px-2 py-1 text-xs text-cyan">Apply</button>
    </form>
  )
}
