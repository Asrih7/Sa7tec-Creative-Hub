import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ children, className = '' }: SectionWrapperProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <section className={`relative ${className}`}>{children}</section>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, rotateX: 8, y: 35 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200, willChange: 'transform, opacity' }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}
