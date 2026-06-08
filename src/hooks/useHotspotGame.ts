import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AnatomyGameConfig,
  AnatomyQuestion,
  AnswerLogEntry,
  GameModeId,
  MissedItem,
  ResultSummary,
} from '../types/game'

type Phase = 'start' | 'playing' | 'complete'
type HotspotStatus = 'correct' | 'done' | 'wrong' | 'missed'

type HotspotFeedback = {
  status: HotspotStatus
  reveal: boolean
}

const QUESTION_SECONDS = 8
const LABEL_REVEAL_MS = 2000

const shuffle = <T,>(values: T[]) => {
  const list = values.slice()
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

const getRating = (accuracy: number) => {
  if (accuracy >= 95) return 'Master'
  if (accuracy >= 80) return 'Excellent'
  if (accuracy >= 60) return 'Good Practice'
  return 'Review Recommended'
}

export const formatTime = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const minutes = String(Math.floor(total / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function useHotspotGame(game: AnatomyGameConfig) {
  const [phase, setPhase] = useState<Phase>('start')
  const [selectedMode, setSelectedMode] = useState<GameModeId>('normal')
  const [order, setOrder] = useState<number[]>(() => game.items.map((_, index) => index))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [missedItems, setMissedItems] = useState<MissedItem[]>([])
  const [answerLog, setAnswerLog] = useState<AnswerLogEntry[]>([])
  const [startTime, setStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [itemStartTime, setItemStartTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS)
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState('Tap Start Quiz to see your first question.')
  const [feedbackTone, setFeedbackTone] = useState<'default' | 'positive' | 'negative'>('default')
  const [hotspotFeedback, setHotspotFeedback] = useState<Record<string, HotspotFeedback>>({})
  const [result, setResult] = useState<ResultSummary | null>(null)
  const revealTimersRef = useRef<number[]>([])

  const currentItem = useMemo<AnatomyQuestion | null>(() => {
    const itemIndex = order[currentIndex]
    return itemIndex === undefined ? null : game.items[itemIndex] ?? null
  }, [currentIndex, game.items, order])

  const activeItemIndex = order[currentIndex]
  const total = order.length
  const remaining = Math.max(0, total - answeredCount)
  const progress = total === 0 ? 0 : Math.round((answeredCount / total) * 100)
  const promptText = phase === 'playing' && currentItem ? currentItem.label : 'Ready to start'
  const instructionText =
    phase === 'playing' && currentItem
      ? currentItem.explanation
      : 'Tap the matching structure on the diagram. If you miss, the correct spot will be shown for review.'
  const timerText = selectedMode === 'timed' && phase === 'playing' ? formatTime(timeLeft * 1000) : formatTime(elapsedTime)

  const resetHotspotFeedback = useCallback(() => {
    revealTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    revealTimersRef.current = []
    setHotspotFeedback({})
  }, [])

  const resetRun = useCallback(() => {
    setOrder(shuffle(game.items.map((_, index) => index)))
    setCurrentIndex(0)
    setScore(0)
    setCorrectCount(0)
    setAnsweredCount(0)
    setStreak(0)
    setBestStreak(0)
    setMissedItems([])
    setAnswerLog([])
    setElapsedTime(0)
    setTimeLeft(QUESTION_SECONDS)
    setLocked(false)
    setResult(null)
    setFeedback('Tap Start Quiz to see your first question.')
    setFeedbackTone('default')
    resetHotspotFeedback()
  }, [game.items, resetHotspotFeedback])

  const showModeSelection = useCallback(() => {
    resetRun()
    setPhase('start')
  }, [resetRun])

  const startGame = useCallback(() => {
    resetRun()
    const now = Date.now()
    setPhase('playing')
    setStartTime(now)
    setItemStartTime(now)
    setFeedback('Tap the correct structure')
    setFeedbackTone('default')
  }, [resetRun])

  const completeGame = useCallback(
    (nextScore: number, nextCorrectCount: number, nextBestStreak: number, nextAnsweredCount: number) => {
      const accuracy = total === 0 ? 0 : Math.round((nextCorrectCount / total) * 100)
      const totalTime = Date.now() - startTime
      setResult({
        total,
        score: nextScore,
        correctCount: nextCorrectCount,
        accuracy,
        totalTime,
        bestStreak: nextBestStreak,
        rating: getRating(accuracy),
      })
      setAnsweredCount(nextAnsweredCount)
      setElapsedTime(totalTime)
      setPhase('complete')
      setLocked(false)
    },
    [startTime, total],
  )

  const advanceQuestion = useCallback(
    (nextScore: number, nextCorrectCount: number, nextBestStreak: number, nextAnsweredCount: number, delay = 700) => {
      window.setTimeout(() => {
        const nextIndex = currentIndex + 1
        if (nextIndex >= total) {
          completeGame(nextScore, nextCorrectCount, nextBestStreak, nextAnsweredCount)
          return
        }
        setCurrentIndex(nextIndex)
        setItemStartTime(Date.now())
        setTimeLeft(QUESTION_SECONDS)
        setLocked(false)
        setFeedback('Tap the correct structure')
        setFeedbackTone('default')
        setHotspotFeedback((current) => {
          const kept: Record<string, HotspotFeedback> = {}
          Object.entries(current).forEach(([id, itemFeedback]) => {
            if (itemFeedback.status === 'done') {
              kept[id] = itemFeedback
            }
          })
          return kept
        })
      }, delay)
    },
    [completeGame, currentIndex, total],
  )

  const answerCurrent = useCallback(
    (isCorrect: boolean, clickedIndex?: number) => {
      if (phase !== 'playing' || locked || currentItem == null || activeItemIndex == null) return

      setLocked(true)
      const timeSpent = Date.now() - itemStartTime
      const correctId = currentItem.id

      if (isCorrect) {
        const nextCorrectCount = correctCount + 1
        const nextAnsweredCount = answeredCount + 1
        const nextStreak = streak + 1
        const nextBestStreak = Math.max(bestStreak, nextStreak)
        const nextScore = score + 100 + Math.max(0, nextStreak - 2) * 10
        setCorrectCount(nextCorrectCount)
        setAnsweredCount(nextAnsweredCount)
        setStreak(nextStreak)
        setBestStreak(nextBestStreak)
        setScore(nextScore)
        setAnswerLog((entries) => [...entries, { item: currentItem, ok: true, note: '' }])
        setFeedback(`✓ ${currentItem.label}`)
        setFeedbackTone('positive')
        setHotspotFeedback((current) => ({
          ...current,
          [correctId]: { status: 'done', reveal: true },
        }))
        const timer = window.setTimeout(() => {
          setHotspotFeedback((current) => ({
            ...current,
            [correctId]: { status: 'done', reveal: false },
          }))
        }, LABEL_REVEAL_MS)
        revealTimersRef.current.push(timer)
        advanceQuestion(nextScore, nextCorrectCount, nextBestStreak, nextAnsweredCount)
      } else {
        const clickedItem = clickedIndex == null ? null : game.items[clickedIndex]
        setStreak(0)
        setFeedback(`✗ Not there. Target: ${currentItem.label}`)
        setFeedbackTone('negative')
        setHotspotFeedback((current) => ({
          ...current,
          ...(clickedItem ? { [clickedItem.id]: { status: 'wrong', reveal: false } } : {}),
          [correctId]: { status: 'correct', reveal: true },
        }))

        if (selectedMode === 'hard') {
          const nextAnsweredCount = answeredCount + 1
          setAnsweredCount(nextAnsweredCount)
          setMissedItems((items) => [...items, { item: currentItem, index: activeItemIndex }])
          setAnswerLog((entries) => [
            ...entries,
            { item: currentItem, ok: false, note: clickedItem ? `clicked ${clickedItem.label}` : 'wrong answer' },
          ])
          advanceQuestion(score, correctCount, bestStreak, nextAnsweredCount, 900)
          return
        }

        window.setTimeout(() => {
          setLocked(false)
          setHotspotFeedback((current) => {
            const next = { ...current }
            if (clickedItem) delete next[clickedItem.id]
            if (next[correctId]?.status === 'correct') delete next[correctId]
            return next
          })
        }, 750)
      }

      window.parent?.postMessage(
        {
          type: 'GAME_EVENT',
          event: 'questionAnswer',
          data: { itemIndex: activeItemIndex, itemId: currentItem.id, isCorrect, score, timeSpent },
        },
        '*',
      )
    },
    [
      activeItemIndex,
      advanceQuestion,
      answeredCount,
      bestStreak,
      correctCount,
      currentItem,
      game.items,
      itemStartTime,
      locked,
      phase,
      score,
      selectedMode,
      streak,
    ],
  )

  const handleHotspotClick = useCallback(
    (index: number) => {
      const clickedItem = game.items[index]
      if (clickedItem && hotspotFeedback[clickedItem.id]?.status === 'done') {
        setHotspotFeedback((current) => ({
          ...current,
          [clickedItem.id]: { status: 'done', reveal: true },
        }))
        const timer = window.setTimeout(() => {
          setHotspotFeedback((current) => ({
            ...current,
            [clickedItem.id]: { status: 'done', reveal: false },
          }))
        }, LABEL_REVEAL_MS)
        revealTimersRef.current.push(timer)
        return
      }
      answerCurrent(index === activeItemIndex, index)
    },
    [activeItemIndex, answerCurrent, game.items, hotspotFeedback],
  )

  const handleOptionClick = useCallback(
    (answer: string) => {
      answerCurrent(answer === currentItem?.correctAnswer)
    },
    [answerCurrent, currentItem?.correctAnswer],
  )

  const skipQuestion = useCallback(() => {
    if (phase !== 'playing' || locked || currentItem == null || activeItemIndex == null) return
    setLocked(true)
    const nextAnsweredCount = answeredCount + 1
    setAnsweredCount(nextAnsweredCount)
    setStreak(0)
    setMissedItems((items) => [...items, { item: currentItem, index: activeItemIndex }])
    setAnswerLog((entries) => [...entries, { item: currentItem, ok: false, note: 'Skipped' }])
    setFeedback(`Skipped: ${currentItem.label}`)
    setFeedbackTone('negative')
    setHotspotFeedback((current) => ({
      ...current,
      [currentItem.id]: { status: 'missed', reveal: true },
    }))
    advanceQuestion(score, correctCount, bestStreak, nextAnsweredCount, 500)
  }, [
    activeItemIndex,
    advanceQuestion,
    answeredCount,
    bestStreak,
    correctCount,
    currentItem,
    locked,
    phase,
    score,
  ])

  useEffect(() => {
    if (phase !== 'playing') return undefined
    const timer = window.setInterval(() => {
      if (selectedMode === 'timed') {
        setTimeLeft((current) => {
          if (locked) return current
          if (current <= 1) {
            skipQuestion()
            return QUESTION_SECONDS
          }
          return current - 1
        })
        return
      }
      setElapsedTime(Date.now() - startTime)
    }, selectedMode === 'timed' ? 1000 : 250)

    return () => window.clearInterval(timer)
  }, [locked, phase, selectedMode, skipQuestion, startTime])

  useEffect(() => {
    return () => resetHotspotFeedback()
  }, [resetHotspotFeedback])

  return {
    phase,
    selectedMode,
    setSelectedMode,
    startGame,
    showModeSelection,
    promptText,
    instructionText,
    currentItem,
    activeItemIndex,
    score,
    remaining,
    progress,
    timerText,
    feedback,
    feedbackTone,
    hotspotFeedback,
    answerLog,
    missedItems,
    result,
    handleHotspotClick,
    handleOptionClick,
    skipQuestion,
    isPracticeMode: selectedMode === 'practice',
  }
}
