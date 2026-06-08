import { useRef, useState } from 'react'
import { AnswerLogDrawer } from './components/AnswerLogDrawer'
import { HudBar } from './components/HudBar'
import { ModeSelectOverlay } from './components/ModeSelectOverlay'
import { OtherGamesSection } from './components/OtherGamesSection'
import { QuizPanel } from './components/QuizPanel'
import { ResultOverlay } from './components/ResultOverlay'
import { SkullDiagram } from './components/SkullDiagram'
import { skullGame } from './data/skullGame'
import { useHotspotGame } from './hooks/useHotspotGame'

const defaultHubUrl = 'https://anatomy-games-hub-demo.vercel.app/'

function getHubUrl() {
  if (typeof window === 'undefined') return defaultHubUrl

  return new URLSearchParams(window.location.search).get('hub') ?? defaultHubUrl
}

const gameConfig = skullGame

function App() {
  const gameState = useHotspotGame(gameConfig)
  const [logOpen, setLogOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const logWrapRef = useRef<HTMLDivElement | null>(null)
  const hubUrl = getHubUrl()

  const handleShellClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!logOpen) return
    if (logWrapRef.current?.contains(event.target as Node)) return
    setLogOpen(false)
  }

  const showModeSelection = () => {
    setLogOpen(false)
    setReviewOpen(false)
    gameState.showModeSelection()
  }

  return (
    <main className="min-h-svh w-screen bg-[#F3F6FB]">
      <div className="mx-auto min-h-svh w-[min(393px,100vw)] bg-[#F3F6FB]">
        <div
          className="relative flex min-h-[min(852px,100svh)] flex-col overflow-visible touch-manipulation"
          onClick={handleShellClick}
        >
          <button
            className="fixed top-4 z-[150] flex h-8 w-8 items-center justify-center rounded-full border border-slate-900/8 bg-white/90 text-[1.25rem] font-extrabold leading-none text-[#007AFF] shadow-[0_10px_24px_rgba(15,23,42,0.10)] backdrop-blur"
            style={{ left: 'max(1rem, calc((100vw - 393px) / 2 + 1rem))' }}
            type="button"
            aria-label="Back to games"
            onPointerDown={(event) => {
              event.stopPropagation()
              window.location.assign(hubUrl)
            }}
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            &lt;
          </button>
          <HudBar title={gameConfig.title} timerText={gameState.timerText} score={gameState.score} remaining={gameState.remaining} />

          <section
            className="relative z-[2] mx-auto mb-[clamp(8px,1.6svh,14px)] grid min-h-0 flex-1 w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-[clamp(6px,1svh,8px)]"
            aria-label={`${gameConfig.topic} labeling game`}
          >
            <SkullDiagram game={gameConfig} state={gameState} />
            <QuizPanel state={{ ...gameState, showModeSelection }} logOpen={logOpen} onToggleLog={() => setLogOpen((open) => !open)} />
          </section>

          <div ref={logWrapRef}>{logOpen && <AnswerLogDrawer entries={gameState.answerLog} />}</div>

          {gameState.phase === 'start' && (
            <ModeSelectOverlay
              game={gameConfig}
              selectedMode={gameState.selectedMode}
              onSelectMode={gameState.setSelectedMode}
              onStart={() => {
                setReviewOpen(false)
                gameState.startGame()
              }}
            />
          )}

          {gameState.phase === 'complete' && gameState.result && (
            <ResultOverlay
              result={gameState.result}
              missedItems={gameState.missedItems}
              reviewOpen={reviewOpen}
              onPlayAgain={showModeSelection}
              onToggleReview={() => setReviewOpen((open) => !open)}
            />
          )}
        </div>
        <div className="bg-[#F3F6FB]">
          <OtherGamesSection currentGameId={gameConfig.id} />
        </div>
      </div>
    </main>
  )
}

export default App
