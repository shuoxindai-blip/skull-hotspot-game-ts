import type { GameModeId } from '../types/game'

export type GameModeConfig = {
  id: GameModeId
  icon: string
  name: string
  description: string
}

export const gameModes: GameModeConfig[] = [
  {
    id: 'normal',
    icon: '🎯',
    name: 'Normal',
    description: 'No timer. Retry after a miss.',
  },
  {
    id: 'timed',
    icon: '⏱️',
    name: 'Timed',
    description: '8 seconds per question.',
  },
  {
    id: 'practice',
    icon: '📖',
    name: 'Practice',
    description: 'Follow one label at a time.',
  },
  {
    id: 'hard',
    icon: '💀',
    name: 'Hard',
    description: 'One miss skips the structure.',
  },
]
