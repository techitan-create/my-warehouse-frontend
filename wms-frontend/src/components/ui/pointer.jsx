import { useEffect, useState } from "react"
import { AnimatePresence, motion, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils"

export function Pointer(
  {
    className,
    style,
    pointer,
    children,
    ...props
  }
) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isActive, setIsActive] = useState(false)
  const [isOverInteractive, setIsOverInteractive] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      
      const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY)
      const isInteractive = elementUnderMouse && (
        elementUnderMouse.tagName === 'BUTTON' ||
        elementUnderMouse.tagName === 'A' ||
        elementUnderMouse.tagName === 'INPUT' || // เพิ่ม INPUT สำหรับกล่องข้อความ
        elementUnderMouse.closest('button') ||
        elementUnderMouse.closest('a') ||
        getComputedStyle(elementUnderMouse).cursor === 'pointer'
      )
      
      if (isInteractive) {
        setIsOverInteractive(true)
        document.body.style.cursor = "auto"
      } else {
        setIsOverInteractive(false)
        document.body.style.cursor = "none"
      }

      setIsActive(true)
    }

    const handleMouseOut = (e) => {
      if (!e.relatedTarget) {
        setIsActive(false)
        document.body.style.cursor = ""
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseout", handleMouseOut)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseout", handleMouseOut)
      document.body.style.cursor = ""
    };
  }, [x, y])

  return (
    <>
      {children}
      <AnimatePresence>
        {isActive && !isOverInteractive && (
          <motion.div
            className="pointer-events-none fixed z-50 transform-[translate(-50%,-50%)]"
            style={{
              top: y,
              left: x,
              ...style,
            }}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            {...props}>
            {pointer || (
              <div className={cn("text-4xl drop-shadow-md", className)}>👆</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}