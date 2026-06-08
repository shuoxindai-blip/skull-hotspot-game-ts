import { useRef, useState } from 'react'
import { AnswerLogDrawer } from './components/AnswerLogDrawer'
import { HudBar } from './components/HudBar'
import { ModeSelectOverlay } from './components/ModeSelectOverlay'
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
    <main className="grid min-h-svh place-items-center">
      <div
        className="relative h-[min(852px,100svh)] w-[min(393px,100vw)] overflow-hidden bg-gradient-to-b from-[#F8FBFF] via-[#F3F6FB] to-[#EEF3F8] touch-manipulation"
        onClick={handleShellClick}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(0,122,255,0.08)_1px,transparent_1px)] bg-[length:30px_30px] opacity-30" />
        <button
          className="absolute left-4 top-4 z-[150] flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/8 bg-white/90 text-[1.4rem] font-extrabold leading-none text-[#007AFF] shadow-[0_10px_24px_rgba(15,23,42,0.10)] backdrop-blur"
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
          className="relative z-[2] mx-auto mb-[clamp(58px,7.6svh,64px)] mt-[clamp(116px,15svh,124px)] flex min-h-[calc(100%-clamp(180px,22svh,188px))] w-full flex-col gap-[clamp(6px,1svh,8px)] pb-[clamp(122px,15svh,138px)]"
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
    </main>
  )
}

export default App
