import type { AnatomyGameConfig } from '../types/game'
import type { useHotspotGame } from '../hooks/useHotspotGame'
import { cn } from '../utils/cn'

type GameState = ReturnType<typeof useHotspotGame>

type SkullDiagramProps = {
  game: AnatomyGameConfig
  state: GameState
}

export function SkullDiagram({ game, state }: SkullDiagramProps) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
      <div className="absolute inset-0 grid place-items-center overflow-visible rounded-3xl bg-gradient-to-b from-white to-[#F2F7FD]">
        <div className="relative flex aspect-[700/550] w-[170%] flex-none translate-y-[-5%] items-center justify-center">
          <img className="block h-full w-full object-contain" src={game.asset.src} alt={game.asset.alt} draggable={false} />

          {game.items.map((item, index) => {
            const status = state.hotspotFeedback[item.id]
            const isActive = state.isPracticeMode && index === state.activeItemIndex
            const showLabel = state.isPracticeMode || status?.reveal
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => state.handleHotspotClick(index)}
                className={cn(
                  'absolute z-10 grid aspect-square min-w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-0 bg-transparent p-0',
                  status?.status === 'wrong' && 'animate-[shake_0.36s_ease-in-out]',
                )}
                style={{
                  left: `${item.hotspot.x}%`,
                  top: `${item.hotspot.y}%`,
                  width: `max(44px, ${item.hotspot.r * 2}%)`,
                }}
              >
                <span
                  className={cn(
                    'absolute inset-[31%] rounded-full border-2 border-white bg-[#007AFF] shadow-[0_0_0_3px_rgba(0,122,255,0.14),0_0_14px_rgba(0,122,255,0.26)] transition',
                    isActive && 'scale-125 shadow-[0_0_0_4px_rgba(0,122,255,0.16),0_0_20px_rgba(0,122,255,0.34)]',
                    status?.status === 'correct' && 'bg-[#34C759] shadow-[0_0_0_4px_rgba(52,199,89,0.16)]',
                    status?.status === 'wrong' && 'bg-[#FF3B30] shadow-[0_0_0_4px_rgba(255,59,48,0.16)]',
                    status?.status === 'missed' && 'bg-[#FF9500] shadow-[0_0_0_4px_rgba(255,149,0,0.16)]',
                  )}
                />
                {showLabel && (
                  <span className="pointer-events-none absolute left-1/2 top-[-12px] z-20 min-w-[88px] -translate-x-1/2 -translate-y-full rounded-[14px] border border-[#34C759] bg-[#EAF8EF] px-2 py-1 text-center text-[0.82rem] font-bold text-[#167A35] shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
                    {item.label}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
