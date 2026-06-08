import type { MissedItem, ResultSummary } from '../types/game'
import { formatTime } from '../hooks/useHotspotGame'
import { GameButton } from './GameButton'

type ResultOverlayProps = {
  result: ResultSummary
  missedItems: MissedItem[]
  reviewOpen: boolean
  onPlayAgain: () => void
  onToggleReview: () => void
}

export function ResultOverlay({ result, missedItems, reviewOpen, onPlayAgain, onToggleReview }: ResultOverlayProps) {
  const title = result.accuracy >= 80 ? 'Great Work' : 'Challenge Complete'
  const eyebrow = result.accuracy === 100 ? 'Perfect Run' : 'Run Complete'
  const medal = result.accuracy >= 95 ? '🏆' : result.accuracy >= 80 ? '⭐' : '🎯'
  const stats = [
    ['Correct', `${result.correctCount}/${result.total}`],
    ['Accuracy', `${result.accuracy}%`],
    ['Time', formatTime(result.totalTime)],
    ['Best Streak', String(result.bestStreak)],
  ] as const

  return (
    <section className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#F3F6FB] p-[clamp(12px,2.4svh,20px)] text-center text-slate-900">
      <div className="w-[calc(100%-40px)]">
        <h1 className="m-0 text-[clamp(1.72rem,7.3vw,2.2rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
          {title}
        </h1>

        <div className="relative mt-[clamp(18px,3svh,26px)] w-full overflow-hidden rounded-[28px] border border-[#007AFF]/15 bg-gradient-to-b from-white to-[#F3F8FF] p-[clamp(18px,3svh,24px)] shadow-[0_18px_42px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="pointer-events-none absolute -right-[18%] -top-[38%] h-40 w-40 rounded-full bg-[#007AFF]/10" />
          <div className="relative mx-auto mb-2 grid h-[58px] w-[58px] place-items-center rounded-full bg-gradient-to-b from-white to-[#E8F3FF] text-[1.65rem] shadow-[0_12px_24px_rgba(0,122,255,0.16)]">
            {medal}
          </div>
          <p className="relative m-0 mb-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#007AFF]">{eyebrow}</p>
          <p className="relative m-0 text-[clamp(3rem,15vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.07em]">
            {result.score}
          </p>
          <span className="relative mt-1 block text-[0.82rem] font-extrabold uppercase tracking-[0.1em] text-slate-500">
            Score
          </span>
          <span className="relative mt-3 inline-flex items-center justify-center rounded-full bg-[#007AFF]/10 px-3 py-2 text-sm font-extrabold text-[#007AFF]">
            {result.rating}
          </span>

          <div className="relative mt-[clamp(16px,2.8svh,20px)] grid grid-cols-2 gap-2.5">
            {stats.map(([label, value]) => (
              <div
                key={label}
                className="min-h-[68px] rounded-[18px] border border-slate-900/5 bg-white/80 p-3 text-left shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
              >
                <span className="mb-1 block text-[0.74rem] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                  {label}
                </span>
                <span className="block text-[clamp(1.08rem,4.4vw,1.34rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(20px,3.4svh,30px)] flex flex-wrap justify-center gap-3">
          <GameButton className="text-[clamp(0.88rem,3.6vw,1rem)] font-extrabold text-white" onClick={onPlayAgain}>
            Play Again
          </GameButton>
          {missedItems.length > 0 && (
            <GameButton className="text-[clamp(0.88rem,3.6vw,1rem)] font-extrabold text-white" onClick={onToggleReview}>
              Review Misses
            </GameButton>
          )}
        </div>

        {reviewOpen && (
          <div className="mt-4 grid max-h-[30vh] gap-2 overflow-auto text-left">
            {missedItems.map(({ item }) => (
              <article key={item.id} className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
                <p className="m-0 font-extrabold text-slate-900">{item.label}</p>
                <p className="m-0 mt-1 text-sm leading-5 text-slate-500">{item.explanation}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
