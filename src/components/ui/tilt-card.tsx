import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
}

export function TiltCard({ children, className = '', glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isHoverable, setIsHoverable] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsHoverable(mediaQuery.matches);
    
    const checkRtl = () => {
      setIsRtl(document.documentElement.dir === 'rtl' || document.body.dir === 'rtl');
    };
    checkRtl();

    const observer = new MutationObserver(checkRtl);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

    return () => observer.disconnect();
  }, [reduceMotion]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const directionMultiplier = isRtl ? -1 : 1;
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10 * directionMultiplier, 10 * directionMultiplier]);
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0, 0.12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverable || !ref.current || reduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!isHoverable || reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        willChange: 'transform',
      }}
      className={`relative rounded-xl transition-shadow duration-300 hover:shadow-2xl ${className}`}
    >
      <div style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }} className="h-full w-full">
        {children}
      </div>
      {glare && (
        <motion.div
          style={{ opacity: glareOpacity }}
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/35 to-white/0 transition-opacity duration-300"
        />
      )}
    </motion.div>
  );
}
