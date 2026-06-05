import type { useHotspotGame } from '../hooks/useHotspotGame'
import { cn } from '../utils/cn'
import { GameButton } from './GameButton'

type GameState = ReturnType<typeof useHotspotGame>

type QuizPanelProps = {
  state: GameState
  logOpen: boolean
  onToggleLog: () => void
}

export function QuizPanel({ state, logOpen, onToggleLog }: QuizPanelProps) {
  return (
    <aside className="order-[-1] flex min-h-[clamp(62px,8svh,68px)] flex-col gap-[clamp(4px,0.8svh,5px)] rounded-[18px] border border-slate-200/80 bg-white/95 p-[clamp(10px,1.6svh,12px)] text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
      <p className="m-0 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[#007AFF]">Hotspot Click</p>
      <h2 className="m-0 text-[clamp(1.05rem,4.5vw,1.2rem)] font-extrabold leading-[1.35] tracking-[-0.02em]">
        {state.promptText}
      </h2>
      <p className="m-0 text-[clamp(0.88rem,3.5vw,1rem)] leading-[1.55] text-slate-500">{state.instructionText}</p>
      <div className="relative h-[5px] overflow-hidden rounded-full bg-slate-500/15" aria-label="Game progress">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#007AFF] to-[#4DA3FF] transition-all"
          style={{ width: `${state.progress}%` }}
        />
      </div>
      <div
        className={cn(
          'absolute bottom-[clamp(68px,9svh,78px)] left-2.5 z-30 min-h-[clamp(40px,5.2svh,44px)] w-[calc(100%-20px)] rounded-[14px] border p-3 text-sm leading-[1.3] shadow-[0_8px_20px_rgba(15,23,42,0.06)]',
          state.feedbackTone === 'positive' && 'border-[#34C759] bg-[#EAF8EF] text-[#167A35]',
          state.feedbackTone === 'negative' && 'border-[#FF3B30] bg-[#FFF0EF] text-[#B42318]',
          state.feedbackTone === 'default' && 'border-slate-200 bg-white text-slate-500',
        )}
      >
        {state.feedback}
      </div>
      <div className="absolute bottom-[clamp(8px,1.3svh,10px)] left-2.5 right-2.5 z-30 flex justify-end gap-[clamp(8px,2.4vw,10px)]">
        <GameButton variant="compact" onClick={onToggleLog}>
          {`Log (${state.answerLog.length})`}
        </GameButton>
        <GameButton variant="compact" onClick={state.skipQuestion}>
          Skip
        </GameButton>
        <GameButton variant="compact" onClick={state.showModeSelection}>
          New Game
        </GameButton>
      </div>
      {logOpen && <span className="sr-only">Answer log is open</span>}
    </aside>
  )
}
