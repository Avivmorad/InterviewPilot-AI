import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default:
          'bg-[linear-gradient(135deg,#3d68ff,#0d4dff)] text-primary-foreground shadow-[0_0_28px_rgb(47_107_255_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgb(47_107_255_/_0.48)]',
        outline:
          'border border-white/12 bg-white/[0.03] text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)] hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10',
        ghost: 'text-white hover:bg-white/[0.06]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-11 px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
