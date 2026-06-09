import { useState } from 'react'

type GameCard = {
  id: string
  title: string
  description: string
  hotspots: number
  url: string
  thumbnail: string
  thumbnailMode?: 'cover'
}

const hubUrl = 'https://anatomy-games-hub-demo.vercel.app/'
const hubParam = encodeURIComponent(hubUrl)

const games: GameCard[] = [
  {
    id: 'skull',
    title: 'Label the Skull',
    description: 'Identify cranial bones and facial structures on the skull diagram.',
    hotspots: 12,
    url: `https://skull-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: '/assets/skull-thumb.png',
  },
  {
    id: 'heart',
    title: 'Label the Heart',
    description: 'Review key chambers, vessels, and heart anatomy landmarks.',
    hotspots: 21,
    url: `https://heart-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: '/assets/heart-thumb.png',
    thumbnailMode: 'cover',
  },
  {
    id: 'human-skeleton',
    title: 'Label the Skeleton',
    description: 'Review major bones and skeletal landmarks from skull to foot.',
    hotspots: 31,
    url: `https://human-skeleton-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: '/assets/skeleton-thumb.svg',
  },
  {
    id: 'muscular-system',
    title: 'Label the Muscles',
    description: 'Practice major muscle groups from head to lower leg.',
    hotspots: 16,
    url: `https://muscular-system-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: '/assets/muscular-thumb.png',
  },
  {
    id: 'brain',
    title: 'Label the Brain',
    description: 'Locate lobes, language areas, cerebellum, and brain stem.',
    hotspots: 10,
    url: `https://brain-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: '/assets/brain-thumb.png',
  },
]

type OtherGamesSectionProps = {
  currentGameId: string
  variant?: 'stacked' | 'compact'
}

export function OtherGamesSection({ currentGameId, variant = 'stacked' }: OtherGamesSectionProps) {
  const recommendations = games.filter((game) => game.id !== currentGameId)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeGame = recommendations[activeIndex]

  const showPrevious = () => {
    setActiveIndex((index) => (index === 0 ? recommendations.length - 1 : index - 1))
  }

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % recommendations.length)
  }

  if (variant === 'compact') {
    if (!activeGame) return null

    return (
      <section className="text-left" aria-label="Other games of interest">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="m-0 text-[clamp(0.78rem,3.2vw,0.88rem)] font-bold tracking-[-0.01em] text-slate-500">
            Other Games of Interest
          </h2>
          <span className="text-[0.68rem] font-bold text-slate-300">
            {activeIndex + 1}/{recommendations.length}
          </span>
        </div>

        <div className="relative">
          <button
            className="absolute left-[-10px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-900/8 bg-white/90 text-[1.35rem] font-bold leading-none text-[#007AFF] shadow-[0_10px_24px_rgba(15,23,42,0.10)] backdrop-blur transition active:scale-95"
            type="button"
            aria-label="Previous game"
            onClick={showPrevious}
          >
            ‹
          </button>

          <a
            className="grid min-h-[122px] grid-cols-[104px_minmax(0,1fr)] gap-3 rounded-[24px] border border-slate-900/7 bg-white/95 p-3 text-inherit no-underline shadow-[0_10px_24px_rgba(21,31,48,0.08)] transition active:scale-[0.985] active:border-[#007AFF]/30"
            href={activeGame.url}
          >
            <span className="flex aspect-square w-[104px] items-center justify-center self-center overflow-hidden rounded-[18px] border border-slate-900/8 bg-white">
              <img
                className={activeGame.thumbnailMode === 'cover' ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-1'}
                src={activeGame.thumbnail}
                alt=""
                loading="lazy"
              />
            </span>

            <span className="flex min-w-0 flex-col justify-center gap-1.5">
              <strong className="text-[0.98rem] leading-[1.12] tracking-[-0.03em] text-slate-950">{activeGame.title}</strong>
              <span className="line-clamp-2 text-[0.74rem] leading-[1.22] text-slate-500">{activeGame.description}</span>
              <span className="mt-1 flex items-center justify-between gap-2">
                <span className="text-[0.7rem] font-bold text-slate-400">{activeGame.hotspots} hotspots</span>
                <span className="inline-flex h-7 min-w-[64px] items-center justify-center rounded-full bg-[#007AFF] px-2.5 text-[0.7rem] font-extrabold text-white">
                  Play
                </span>
              </span>
            </span>
          </a>

          <button
            className="absolute right-[-10px] top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-900/8 bg-white/90 text-[1.35rem] font-bold leading-none text-[#007AFF] shadow-[0_10px_24px_rgba(15,23,42,0.10)] backdrop-blur transition active:scale-95"
            type="button"
            aria-label="Next game"
            onClick={showNext}
          >
            ›
          </button>
        </div>

        <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
          {recommendations.map((game, index) => (
            <span
              key={game.id}
              className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-5 bg-[#007AFF]' : 'w-1.5 bg-slate-300'}`}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 pb-8 pt-5" aria-label="Other games of interest">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[1.08rem] font-extrabold tracking-[-0.03em] text-slate-900">Other Games of Interest</h2>
        <span className="text-[0.78rem] font-bold text-slate-400">Tap to play</span>
      </div>

      <div className="grid gap-3">
        {recommendations.map((game) => (
          <a
            key={game.id}
            className="grid min-h-[112px] grid-cols-[82px_1fr] gap-3 overflow-hidden rounded-[24px] border border-slate-900/7 bg-white/95 p-3 text-left text-inherit no-underline shadow-[0_14px_34px_rgba(21,31,48,0.08)] transition active:scale-[0.985] active:border-[#007AFF]/30"
            href={game.url}
          >
            <span className="flex h-[88px] w-[82px] items-center justify-center overflow-hidden rounded-[20px] border border-slate-900/8 bg-white">
              <img
                className={game.thumbnailMode === 'cover' ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-1'}
                src={game.thumbnail}
                alt=""
                loading="lazy"
              />
            </span>

            <span className="flex min-w-0 flex-col justify-center">
              <strong className="text-[1.02rem] leading-[1.12] tracking-[-0.03em] text-slate-950">{game.title}</strong>
              <span className="mt-1.5 text-[0.82rem] leading-[1.28] text-slate-500">{game.description}</span>
              <span className="mt-2.5 flex items-center gap-2">
                <span className="text-[0.74rem] font-bold text-slate-400">{game.hotspots} hotspots</span>
                <span className="ml-auto inline-flex h-8 min-w-[78px] items-center justify-center rounded-full bg-[#007AFF] px-3 text-[0.76rem] font-extrabold text-white">
                  Play Now
                </span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
