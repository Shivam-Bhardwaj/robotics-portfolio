"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import Typewriter from "@/components/Typewriter";
import { Button } from "@/components/ui";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <motion.section 
      className="relative overflow-hidden flex flex-col items-center text-center gap-8 section-padding"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div 
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-r from-fuchsia-400/30 to-purple-400/30 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" as const 
          }}
        />
        <motion.div 
          className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-400/30 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" as const 
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-electric/10 to-neon/10 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" as const 
          }}
        />
      </div>

      {/* Hero Content */}
      <motion.div 
        className="flex flex-col items-center gap-6"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gradient max-w-4xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {siteConfig.name}
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-foreground-secondary font-medium"
          variants={itemVariants}
        >
          <span className="text-robotics text-brand-primary">{siteConfig.role}</span> • {siteConfig.location}
        </motion.p>
      </motion.div>

      {/* Typewriter Section */}
      <motion.div 
        className="max-w-3xl"
        variants={itemVariants}
      >
        <div className="text-xl md:text-2xl text-foreground-secondary font-medium leading-relaxed">
          <Typewriter
            phrases={[
              "The gap between prototype and product? I live there.",
              "From self-driving to med-tech, I ship reliable systems.",
              "I optimize, reduce costs, and deliver hardware at scale.",
            ]}
          />
        </div>
      </motion.div>

      {/* Description */}
      <motion.p 
        className="max-w-4xl text-base md:text-lg text-foreground-muted leading-relaxed"
        variants={itemVariants}
      >
        As both a hands-on engineer and project manager, I turn complex concepts in self-driving and med-tech into reliable, deployed systems. I optimize, reduce costs, and ship products for companies like{" "}
        <span className="font-semibold text-brand-primary">Meta</span>,{" "}
        <span className="font-semibold text-brand-primary">Applied Materials</span>,{" "}
        <span className="font-semibold text-brand-primary">Google</span>,{" "}
        <span className="font-semibold text-brand-primary">GoPro</span>,{" "}
        <span className="font-semibold text-brand-primary">Saildrone</span>,{" "}
        <span className="font-semibold text-brand-primary">Velodyne Lidar</span>,{" "}
        <span className="font-semibold text-brand-primary">Tesla</span>, and more than twenty startups and researchers.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mobile-stack"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/projects">
            <Button variant="primary" size="lg">
              View Projects
            </Button>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/skills">
            <Button variant="secondary" size="lg">
              My Skills
            </Button>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/swarm">
            <Button variant="robotics" size="lg">
              Play Swarm Game
            </Button>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
          className="w-6 h-10 border-2 border-brand-primary rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
            className="w-1 h-3 bg-brand-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
