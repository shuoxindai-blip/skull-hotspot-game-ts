export type GameModeId = 'normal' | 'timed' | 'practice' | 'hard'

export type Hotspot = {
  x: number
  y: number
  r: number
}

export type QuizOption = {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
}

export type AnatomyQuestion = {
  id: string
  label: string
  prompt: string
  hotspot: Hotspot
  options: QuizOption[]
  correctAnswer: QuizOption['label']
  aliases?: string[]
  explanation: string
}

export type AnatomyGameConfig = {
  id: string
  title: string
  topic: string
  description: string
  asset: {
    src: string
    alt: string
    aspectRatio?: string
    width?: string
    translateY?: string
  }
  items: AnatomyQuestion[]
}

export type AnswerLogEntry = {
  item: AnatomyQuestion
  ok: boolean
  note: string
}

export type MissedItem = {
  item: AnatomyQuestion
  index: number
}

export type ResultSummary = {
  total: number
  score: number
  correctCount: number
  accuracy: number
  totalTime: number
  bestStreak: number
  rating: string
}
