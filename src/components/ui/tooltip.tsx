"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

// The reference component imported a `tooltip-1` built on Radix. This is the
// Base UI equivalent, matching the rest of src/components/ui.

function TooltipProvider({
  delay = 0,
  closeDelay = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delay={delay} closeDelay={closeDelay} {...props} />
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger({ className, ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" className={cn(className)} {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 10,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  side?: React.ComponentProps<typeof TooltipPrimitive.Positioner>["side"]
  sideOffset?: number
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs leading-snug text-popover-foreground shadow-md",
            "origin-(--transform-origin) transition-[transform,opacity] duration-150",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

/**
 * Optional caret, placed inside <TooltipContent>. It takes the popup's
 * background, so it suits a filled tooltip rather than the default bordered one.
 */
function TooltipArrow({ className, ...props }: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        "size-2 rotate-45 rounded-[2px] bg-inherit",
        "data-[side=top]:-bottom-1 data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1",
        className,
      )}
      {...props}
    />
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipArrow, TooltipProvider }
