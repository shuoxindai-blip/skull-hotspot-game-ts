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
    thumbnail: 'https://anatomy-games-hub-demo.vercel.app/assets/skull-thumb.png',
  },
  {
    id: 'heart',
    title: 'Label the Heart',
    description: 'Review key chambers, vessels, and heart anatomy landmarks.',
    hotspots: 21,
    url: `https://heart-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: 'https://anatomy-games-hub-demo.vercel.app/assets/heart-thumb.png',
    thumbnailMode: 'cover',
  },
  {
    id: 'human-skeleton',
    title: 'Label the Skeleton',
    description: 'Match labels to skeletal landmarks using arrow endpoint hotspots.',
    hotspots: 27,
    url: `https://human-skeleton-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: 'https://anatomy-games-hub-demo.vercel.app/assets/skeleton-thumb.svg',
  },
  {
    id: 'muscular-system',
    title: 'Label the Muscles',
    description: 'Practice major muscle groups from head to lower leg.',
    hotspots: 16,
    url: `https://muscular-system-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: 'https://anatomy-games-hub-demo.vercel.app/assets/muscular-thumb.png',
  },
  {
    id: 'brain',
    title: 'Label the Brain',
    description: 'Locate lobes, language areas, cerebellum, and brain stem.',
    hotspots: 10,
    url: `https://brain-hotspot-game-ts.vercel.app/?hub=${hubParam}`,
    thumbnail: 'https://anatomy-games-hub-demo.vercel.app/assets/brain-thumb.png',
  },
]

type OtherGamesSectionProps = {
  currentGameId: string
}

export function OtherGamesSection({ currentGameId }: OtherGamesSectionProps) {
  const recommendations = games.filter((game) => game.id !== currentGameId)

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
