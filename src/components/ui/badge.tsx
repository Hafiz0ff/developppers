import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex min-h-5.5 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary [a]:hover:bg-primary/20",
        secondary:
          "border-border/60 bg-muted text-muted-foreground [a]:hover:bg-muted/80",
        destructive:
          "border-transparent bg-destructive/10 text-destructive [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "border-transparent hover:bg-muted hover:text-foreground",
        link:
          "border-transparent text-primary underline-offset-4 hover:underline",
        // Backward-compatible clean mappings (zero neon glows, zero raw triplets)
        emerald:
          "border-primary/20 bg-primary/10 text-primary",
        emeraldSubtle:
          "border-primary/20 bg-primary/10 text-primary",
        frosted:
          "border-border/80 bg-background/80 backdrop-blur-md text-foreground shadow-xs",
        frostedLight:
          "border-border/80 bg-background/90 backdrop-blur-md text-foreground shadow-xs",
        gold:
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        goldSubtle:
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        amenity:
          "border-border/80 bg-card text-foreground",
        neon:
          "border-primary/20 bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "secondary",
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
