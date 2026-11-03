import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex min-h-5.5 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Tahoe / Apple Glassmorphic Design System Variants
        emerald:
          "bg-emerald-500/35 hover:bg-emerald-500/45 backdrop-blur-xl border-emerald-400/50 text-white font-bold shadow-[0_4px_16px_rgba(16,185,129,0.30),inset_0_1px_1.5px_rgba(255,255,255,0.45)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
        emeraldSubtle:
          "bg-emerald-50/90 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 font-semibold shadow-xs",
        frosted:
          "bg-black/35 hover:bg-black/45 backdrop-blur-xl border-white/25 text-white font-bold shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
        frostedLight:
          "bg-white/90 hover:bg-white backdrop-blur-xl border-white/60 text-slate-800 font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:bg-slate-900/85 dark:text-white dark:border-white/15",
        gold:
          "bg-amber-500/35 hover:bg-amber-500/45 backdrop-blur-xl border-amber-400/55 text-white font-bold shadow-[0_4px_16px_rgba(245,158,11,0.30),inset_0_1px_1.5px_rgba(255,255,255,0.45)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
        goldSubtle:
          "bg-amber-50/90 text-amber-900 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40 font-bold shadow-xs",
        amenity:
          "glass-amenity-card text-slate-700 dark:text-slate-200 font-semibold border-slate-200/80 dark:border-white/10",
        neon:
          "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
