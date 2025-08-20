import { Variants } from "framer-motion";

// ===========================
// MOTION ANIMATION LIBRARY
// ===========================

// Base animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

// Container animations for staggered children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

// Robotics-themed animations
export const roboticsGlow: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    boxShadow: "0 0 0px rgba(6, 182, 212, 0)"
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
    transition: { duration: 0.7, ease: "easeOut" as const }
  }
};

export const electricPulse: Variants = {
  hidden: { 
    opacity: 0,
    boxShadow: "0 0 0px rgba(6, 182, 212, 0)"
  },
  visible: { 
    opacity: 1,
    boxShadow: [
      "0 0 0px rgba(6, 182, 212, 0)",
      "0 0 20px rgba(6, 182, 212, 0.5)",
      "0 0 30px rgba(6, 182, 212, 0.3)",
      "0 0 20px rgba(6, 182, 212, 0.5)",
      "0 0 0px rgba(6, 182, 212, 0)"
    ],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Card hover animations
export const cardHover = {
  hover: { 
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const cardHoverRobotics = {
  hover: { 
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.4)",
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Button hover animations
export const buttonHover = {
  hover: { 
    scale: 1.05,
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const buttonHoverRobotics = {
  hover: { 
    scale: 1.05,
    y: -2,
    boxShadow: "0 10px 25px rgba(6, 182, 212, 0.4)",
    transition: { duration: 0.2, ease: "easeOut" as const }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Navigation animations
export const navSlide: Variants = {
  hidden: { y: -100 },
  visible: { 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export const navItemSlide: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const }
  }
};

// Background animations
export const floatingBackground = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

export const rotatingBackground = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear" as const
    }
  }
};

export const pulsingBackground = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Loading animations
export const spinnerRotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear" as const
    }
  }
};

export const dotsLoading = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Page transition animations
export const pageTransition: Variants = {
  hidden: { opacity: 0, x: -200, scale: 0.8 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  },
  exit: { 
    opacity: 0, 
    x: 200, 
    scale: 0.8,
    transition: { duration: 0.3, ease: "easeIn" as const }
  }
};

// Text reveal animations
export const textReveal: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

export const letterReveal: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

// Image animations
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

export const imageHover = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" as const }
  }
};

// Modal animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const }
  }
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    transition: { duration: 0.3, ease: "easeIn" as const }
  }
};

// Utility functions for creating custom animations
export const createStaggerContainer = (staggerDelay: number = 0.1, childrenDelay: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childrenDelay
    }
  }
});

export const createSlideVariant = (direction: 'up' | 'down' | 'left' | 'right', distance: number = 50): Variants => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
    }
  };

  return {
    hidden: { opacity: 0, ...getInitialPosition() },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };
};

// Animation presets for common use cases
export const presets = {
  // Page animations
  pageEnter: pageTransition,
  
  // Component animations
  cardEnter: slideUp,
  buttonPress: buttonHover,
  
  // Background animations
  heroBackground: floatingBackground,
  
  // Loading states
  loading: spinnerRotate,
  
  // Text animations
  titleReveal: textReveal,
  
  // Layout animations
  stagger: staggerContainer
};