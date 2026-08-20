"use client"

import * as React from "react"
import { motion, type Transition } from "motion/react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Ported from the Radix reference to Base UI, which is what this project's
// shadcn style ("base-nova") and every other primitive in src/components/ui use.

type AvatarContainerProps = {
  children: React.ReactNode
  zIndex: number
  transition: Transition
  translate: string | number
}

function AvatarContainer({ children, zIndex, transition, translate }: AvatarContainerProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <motion.div
            data-slot="avatar-container"
            initial="initial"
            whileHover="hover"
            whileFocus="hover"
            whileTap="hover"
            className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ zIndex }}
          >
            <motion.div
              variants={{ initial: { y: 0 }, hover: { y: translate } }}
              transition={transition}
            >
              {children}
            </motion.div>
          </motion.div>
        }
      />
    </Tooltip>
  )
}

/**
 * Tooltip body for an avatar. Sits inside <Avatar> in JSX but portals out, so
 * the avatar's `overflow-hidden` never clips it.
 */
function AvatarGroupTooltip(props: React.ComponentProps<typeof TooltipContent>) {
  return <TooltipContent {...props} />
}

type AvatarGroupProps = Omit<React.ComponentProps<"div">, "translate"> & {
  children: React.ReactElement[]
  transition?: Transition
  invertOverlap?: boolean
  translate?: string | number
}

function AvatarGroup({
  ref,
  children,
  className,
  transition = { type: "spring", stiffness: 300, damping: 17 },
  invertOverlap = false,
  translate = "-30%",
  ...props
}: AvatarGroupProps) {
  return (
    <TooltipProvider>
      <div
        ref={ref}
        data-slot="avatar-group"
        className={cn("flex h-8 flex-row items-center -space-x-2", className)}
        {...props}
      >
        {children?.map((child, index) => (
          <AvatarContainer
            key={index}
            zIndex={invertOverlap ? React.Children.count(children) - index : index}
            transition={transition}
            translate={translate}
          >
            {child}
          </AvatarContainer>
        ))}
      </div>
    </TooltipProvider>
  )
}

export { AvatarGroup, AvatarGroupTooltip, type AvatarGroupProps }
