import { useRef, useState } from 'react'
import { AnswerLogDrawer } from './components/AnswerLogDrawer'
import { HudBar } from './components/HudBar'
import { ModeSelectOverlay } from './components/ModeSelectOverlay'
import { QuizPanel } from './components/QuizPanel'
import { ResultOverlay } from './components/ResultOverlay'
import { SkullDiagram } from './components/SkullDiagram'
import { skullGame } from './data/skullGame'
import { useHotspotGame } from './hooks/useHotspotGame'

function App() {
  const gameState = useHotspotGame(skullGame)
  const [logOpen, setLogOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const logWrapRef = useRef<HTMLDivElement | null>(null)

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
        <HudBar timerText={gameState.timerText} score={gameState.score} remaining={gameState.remaining} />

        <section
          className="relative z-[2] mx-auto mb-[clamp(58px,7.6svh,64px)] mt-[clamp(66px,9.8svh,82px)] flex min-h-[calc(100%-146px)] w-full flex-col gap-[clamp(6px,1svh,8px)]"
          aria-label="Skull anatomy labeling game"
        >
          <SkullDiagram game={skullGame} state={gameState} />
          <QuizPanel state={{ ...gameState, showModeSelection }} logOpen={logOpen} onToggleLog={() => setLogOpen((open) => !open)} />
        </section>

        <div ref={logWrapRef}>{logOpen && <AnswerLogDrawer entries={gameState.answerLog} />}</div>

        {gameState.phase === 'start' && (
          <ModeSelectOverlay
            game={skullGame}
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
