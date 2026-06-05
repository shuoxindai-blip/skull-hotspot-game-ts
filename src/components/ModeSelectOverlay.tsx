import { gameModes } from '../data/gameModes'
import type { AnatomyGameConfig, GameModeId } from '../types/game'
import { cn } from '../utils/cn'
import { GameButton } from './GameButton'

type ModeSelectOverlayProps = {
  game: AnatomyGameConfig
  selectedMode: GameModeId
  onSelectMode: (mode: GameModeId) => void
  onStart: () => void
}

export function ModeSelectOverlay({ game, selectedMode, onSelectMode, onStart }: ModeSelectOverlayProps) {
  return (
    <section className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#F6F9FD]/95 p-[clamp(12px,2.4svh,20px)] text-center text-slate-900">
      <div className="w-[calc(100%-40px)]">
        <div className="grid gap-[clamp(20px,3.6svh,30px)]">
          <div className="grid gap-[clamp(7px,1.1svh,10px)]">
            <h1 className="m-0 text-[clamp(1.72rem,7.3vw,2.2rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
              {game.title}
            </h1>
            <p className="m-0 text-[clamp(0.88rem,3.6vw,1rem)] leading-[1.48] text-slate-500">{game.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-[clamp(8px,1.5svh,12px)]">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode(mode.id)}
                className={cn(
                  'min-h-[clamp(70px,10.8svh,92px)] cursor-pointer rounded-3xl border bg-white p-[clamp(10px,1.8svh,14px)] text-left font-inherit text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5',
                  selectedMode === mode.id
                    ? 'border-[#007AFF] shadow-[0_0_0_3px_rgba(0,122,255,0.12),0_10px_24px_rgba(0,122,255,0.10)]'
                    : 'border-slate-200/80',
                )}
              >
                <span className="mb-1 block text-[clamp(0.88rem,3.6vw,1rem)] font-extrabold">
                  {mode.icon} {mode.name}
                </span>
                <span className="block text-[clamp(0.78rem,3.2vw,0.9rem)] leading-[1.35] text-slate-500">
                  {mode.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(20px,3.4svh,30px)] flex justify-center">
          <GameButton className="text-[clamp(0.88rem,3.6vw,1rem)]" onClick={onStart}>
            Start Quiz
          </GameButton>
        </div>
      </div>
    </section>
  )
}
