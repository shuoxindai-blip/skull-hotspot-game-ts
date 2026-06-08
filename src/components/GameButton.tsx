import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../utils/cn'

type GameButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'compact'
  }
>

export function GameButton({ children, className, variant = 'primary', ...props }: GameButtonProps) {
  return (
    <button
      className={cn(
        'min-h-11 cursor-pointer rounded-full px-7 py-3 font-extrabold transition duration-150 hover:scale-[1.04] active:scale-95',
        variant === 'primary' && 'bg-[#007AFF] text-white',
        variant === 'secondary' && 'border border-slate-200 bg-[#EEF5FF] text-[#007AFF]',
        variant === 'compact' &&
          'min-h-10 rounded-[14px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.06)]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
