type HudBarProps = {
  timerText: string
  score: number
  remaining: number
}

export function HudBar({ timerText, score, remaining }: HudBarProps) {
  const items = [
    ['Time', timerText],
    ['Score', score],
    ['Left', remaining],
  ] as const

  return (
    <header className="pointer-events-none absolute left-1/2 top-0 z-20 flex w-full max-w-[480px] -translate-x-1/2 justify-between gap-2 px-3 py-[clamp(8px,1.4svh,10px)]">
      <div className="flex min-w-0 gap-2">
        <div className="flex min-w-0 items-center whitespace-nowrap text-base font-extrabold text-slate-900">
          🦴 Skull <span className="ml-1 text-[#007AFF]">Anatomy</span>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap gap-2">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="pointer-events-auto whitespace-nowrap rounded-2xl border border-slate-200/80 bg-white/95 px-[clamp(9px,2.8vw,12px)] py-[clamp(7px,1.1svh,8px)] text-center text-[0.78rem] font-bold uppercase tracking-[0.05em] text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.06)] backdrop-blur"
          >
            {label}
            <span className="mt-0.5 block text-base tracking-normal text-[#007AFF]">{value}</span>
          </div>
        ))}
      </div>
    </header>
  )
}
