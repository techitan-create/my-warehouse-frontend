import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils"

/**
 * A custom pointer component that displays an animated cursor.
 * Add this as a child to any component to enable a custom pointer when hovering.
 * You can pass custom children to render as the pointer.
 *
 * @component
 * @param {HTMLMotionProps<"div">} props - The component props
 */
export function Pointer(
  {
    className,
    style,
    children,
    ...props
  }
) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isActive, setIsActive] = useState(false)
  // --- แก้ไข: เพิ่ม State เพื่อเช็คว่าเมาส์อยู่เหนือปุ่มหรือไม่ ---
  const [isOverInteractive, setIsOverInteractive] = useState(false)
  // --------------------------------------------------------
  const containerRef = useRef(null)

  useEffect(() => {
    const parentElement =
      typeof window !== "undefined"
        ? (containerRef.current?.parentElement ?? null)
        : null

    const handleMouseMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      
      // --- แก้ไข: เพิ่มตรรกะตรวจจับการ Hover เหนือปุ่มหรือลิงก์ ---
      const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = elementUnderMouse && (
        elementUnderMouse.tagName === 'BUTTON' || 
        elementUnderMouse.tagName === 'A' ||
        elementUnderMouse.closest('button') || 
        elementUnderMouse.closest('a') ||
        getComputedStyle(elementUnderMouse).cursor === 'pointer'
      );
      
      if (isInteractive) {
        setIsOverInteractive(true);
        // แสดงเมาส์ปกติ (Browser จะทำเองถ้าเราไม่สั่ง cursor: none)
        if (parentElement) parentElement.style.cursor = "auto"; 
      } else {
        setIsOverInteractive(false);
        // ซ่อนเมาส์ปกติ และแสดงนิ้วชี้แทน
        if (parentElement) parentElement.style.cursor = "none";
      }
      // -----------------------------------------------------

      setIsActive(true)
    }

    const handleMouseEnter = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setIsActive(true)
    }

    const handleMouseLeave = () => {
      setIsActive(false)
    }

    if (parentElement) {
      // เอาบรรทัดนี้ออก: parentElement.style.cursor = "none" 
      // เราจะคุมผ่าน handleMouseMove แทน
      parentElement.addEventListener("mousemove", handleMouseMove)
      parentElement.addEventListener("mouseenter", handleMouseEnter)
      parentElement.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (parentElement) {
        parentElement.style.cursor = ""
        parentElement.removeEventListener("mousemove", handleMouseMove)
        parentElement.removeEventListener("mouseenter", handleMouseEnter)
        parentElement.removeEventListener("mouseleave", handleMouseLeave)
      }
    };
  }, [x, y])

  return (
    <>
      <div ref={containerRef} />
      <AnimatePresence>
        {/* --- แก้ไข: เพิ่มเงื่อนไข !isOverInteractive --- */}
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
            {children || (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("rotate-[-70deg] stroke-white text-black", className)}>
                <path
                  d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}