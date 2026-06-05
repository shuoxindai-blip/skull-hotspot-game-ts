import type { AnswerLogEntry } from '../types/game'

type AnswerLogDrawerProps = {
  entries: AnswerLogEntry[]
}

export function AnswerLogDrawer({ entries }: AnswerLogDrawerProps) {
  return (
    <aside className="absolute bottom-[72px] right-3 z-40 w-[min(320px,calc(100%-24px))] rounded-3xl border border-slate-200/80 bg-white/95 p-4 text-left shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur">
      <p className="m-0 mb-3 font-extrabold text-slate-900">Answer Log</p>
      <div className="grid max-h-[40vh] gap-2 overflow-auto">
        {entries.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">No answers yet.</div>
        ) : (
          entries.map((entry, index) => (
            <div key={`${entry.item.id}-${index}`} className="grid grid-cols-[auto_1fr] gap-2 rounded-2xl bg-slate-50 p-3 text-sm">
              <span className={entry.ok ? 'font-extrabold text-[#34C759]' : 'font-extrabold text-[#FF3B30]'}>
                {entry.ok ? '✓' : '✗'}
              </span>
              <div>
                <strong className="block text-slate-900">{entry.item.label}</strong>
                {entry.note && <span className="text-slate-500">{entry.note}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
