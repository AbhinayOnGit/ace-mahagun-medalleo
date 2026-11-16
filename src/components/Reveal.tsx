"use client";

import { motion, useReducedMotion } from "motion/react";
import ImpressionTag from "./ImpressionTag";

type Props = { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "section" };

export default function Reveal({ children, delay = 0, y = 28, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Image that drifts gently against scroll for a parallax feel. */
export function ParallaxImage({ src, alt, className = "", strength = 8, label = true }: { src: string; alt: string; className?: string; strength?: number; label?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-[115%] w-full object-cover"
        initial={reduce ? false : { y: `-${strength}%` }}
        whileInView={{ y: "0%" }}
        viewport={{ once: false, amount: 0 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {label && <ImpressionTag />}
    </div>
  );
}
