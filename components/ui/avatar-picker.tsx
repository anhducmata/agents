"use client"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AvatarOption {
  id: string
  src: string
  label: string
}

interface AvatarPickerProps {
  options: AvatarOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

// Add these animation variants at the top level
const mainAvatarVariants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const pickerVariants = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
}

const selectedVariants = {
  initial: {
    opacity: 0,
    rotate: -180,
  },
  animate: {
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    rotate: 180,
    transition: {
      duration: 0.2,
    },
  },
}

export function AvatarPicker({ options, value, onChange, className }: AvatarPickerProps) {
  const [rotationCount, setRotationCount] = useState(0)
  const [prevValue, setPrevValue] = useState(value)

  // Track when the value changes to trigger rotation
  useEffect(() => {
    if (value !== prevValue) {
      setRotationCount((prev) => prev + 360) // Add one full rotation
      setPrevValue(value)
    }
  }, [value, prevValue])

  const selectedAvatar = options.find((option) => option.id === value)

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <motion.div
        className="flex items-center justify-center w-24 h-24 rounded-full overflow-hidden border-1 border-primary/20"
        animate={{ rotate: rotationCount }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 0.8,
        }}
      >
        {selectedAvatar?.src ? (
          <Image
            src={selectedAvatar.src || ""}
            alt="Selected avatar"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-4xl">🤖</div>
        )}
      </motion.div>

      <motion.div
        className="grid grid-cols-5 gap-3 justify-center"
        variants={pickerVariants.container}
        initial="initial"
        animate="animate"
      >
        {options.map((option) => (
          <motion.button
            key={option.id}
            variants={pickerVariants.item}
            type="button"
            onClick={() => {
              console.log("Avatar selected:", option.id)
              onChange(option.id)
            }}
            className={cn(
              "relative w-14 h-14 rounded-full overflow-hidden transition-all border-2",
              value === option.id ? "ring-2 ring-offset-2" : "border-transparent",
            )}
            title={option.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={option.src || "/placeholder.svg"}
              alt={option.label}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
