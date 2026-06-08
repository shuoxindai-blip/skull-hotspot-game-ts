import type { AnatomyGameConfig } from '../types/game'
import type { useHotspotGame } from '../hooks/useHotspotGame'
import { cn } from '../utils/cn'

type GameState = ReturnType<typeof useHotspotGame>

type SkullDiagramProps = {
  game: AnatomyGameConfig
  state: GameState
}

function getLabelStyle(item: AnatomyGameConfig['items'][number]) {
  return {
    left: `${item.hotspot.x}%`,
    top: `${item.hotspot.y}%`,
    transform:
      item.hotspot.x < 28
        ? 'translate(0, calc(-100% - 5px))'
        : item.hotspot.x > 72
          ? 'translate(-100%, calc(-100% - 5px))'
          : 'translate(-50%, calc(-100% - 5px))',
  }
}

export function SkullDiagram({ game, state }: SkullDiagramProps) {
  const imageLayout = {
    aspectRatio: game.asset.aspectRatio ?? '700 / 550',
    width: game.asset.width ?? '170%',
    flexBasis: game.asset.width ?? '170%',
    transform: `translateY(${game.asset.translateY ?? '-5%'})`,
  }

  return (
    <div className="relative flex min-h-0 flex-col gap-0 bg-transparent p-0">
      <div className="diagram-stage-exact relative overflow-hidden border border-slate-900/5 bg-white shadow-[inset_0_-1px_0_rgba(15,23,42,0.04)]">
        <div className="absolute inset-2 flex items-center justify-center">
          <div className="diagram-inner-exact relative flex max-w-none items-center justify-center" style={imageLayout}>
            <img
              className="block h-full w-full select-none object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.12)]"
              src={game.asset.src}
              alt={game.asset.alt}
              draggable={false}
            />

            {game.items.map((item, index) => {
              const status = state.hotspotFeedback[item.id]
              const isActive = state.isPracticeMode && index === state.activeItemIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  onClick={() => state.handleHotspotClick(index)}
                  className="absolute z-[5] aspect-square -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-transparent bg-transparent p-0"
                  style={{
                    left: `${item.hotspot.x}%`,
                    top: `${item.hotspot.y}%`,
                    width: '24px',
                  }}
                >
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full border-2 border-white bg-[#007AFF] opacity-100 shadow-[0_0_0_3px_rgba(0,122,255,0.14),0_0_14px_rgba(0,122,255,0.26)] transition-[opacity,transform] duration-200',
                      isActive && 'scale-[1.18] shadow-[0_0_0_4px_rgba(0,122,255,0.16),0_0_20px_rgba(0,122,255,0.34)]',
                      status?.status === 'correct' && 'border-[#34C759] bg-[#EAF8EF]',
                      status?.status === 'done' &&
                        'border-white bg-[#34C759] shadow-[0_0_0_3px_rgba(34,197,94,0.24),0_0_18px_rgba(34,197,94,0.55)]',
                      status?.status === 'wrong' &&
                        'animate-[dot-shiver_0.26s_ease-in-out_2] border-[#FF3B30] bg-[#FFF0EF] shadow-[0_0_0_3px_rgba(255,59,48,0.16)]',
                      status?.status === 'missed' && 'border-[#FF9500] bg-[#FFF7E8]',
                    )}
                  />
                </button>
              )
            })}

            {game.items.map((item, index) => {
              const status = state.hotspotFeedback[item.id]
              const showLabel = status?.reveal || (state.isPracticeMode && index === state.activeItemIndex)
              if (!showLabel) return null

              return (
                <span
                  key={`${item.id}-label`}
                  className="pointer-events-none absolute z-[100] min-w-[88px] rounded-[14px] border border-[#34C759] bg-[#EAF8EF] px-2 py-1 text-center text-[0.82rem] font-bold text-[#167A35] shadow-[0_12px_30px_rgba(15,23,42,0.10)]"
                  style={getLabelStyle(item)}
                >
                  {item.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
