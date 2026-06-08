type HudBarProps = {
  title: string
  timerText: string
  score: number
  remaining: number
}

export function HudBar({ title, timerText, score, remaining }: HudBarProps) {
  const items = [
    ['Time', timerText],
    ['Score', score],
    ['Left', remaining],
  ] as const

  return (
    <header className="pointer-events-none absolute left-1/2 top-0 z-20 grid w-full max-w-[480px] -translate-x-1/2 gap-[clamp(6px,1svh,8px)] px-3 py-[clamp(8px,1.4svh,10px)]">
      <h1 className="m-0 text-center text-[clamp(1rem,4.2vw,1.12rem)] font-extrabold leading-tight tracking-[-0.02em] text-slate-900">
        {title.replace(' Challenge', '')} <span className="text-[#007AFF]">Challenge</span>
      </h1>
      <div className="grid min-w-0 grid-cols-3 gap-2">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="pointer-events-auto min-w-0 rounded-2xl border border-slate-200/80 bg-white/95 px-[clamp(7px,2.4vw,10px)] py-[clamp(6px,1svh,8px)] text-center text-[clamp(0.68rem,2.8vw,0.78rem)] font-bold uppercase tracking-[0.05em] text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.06)] backdrop-blur"
          >
            {label}
            <span className="mt-0.5 block truncate text-[clamp(0.9rem,3.8vw,1rem)] tracking-normal text-[#007AFF]">{value}</span>
          </div>
        ))}
      </div>
    </header>
  )
}
