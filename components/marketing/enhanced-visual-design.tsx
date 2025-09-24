"use client";

import { Card, CardContent } from '@/components/ui/card';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    Shield,
    Star,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

function FloatingElement({ children, delay = 0, duration = 3, className = '' }: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

interface GlowingCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

function GlowingCard({ children, glowColor = 'blue', className = '', onClick }: GlowingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    blue: 'shadow-blue-500/25',
    green: 'shadow-green-500/25',
    purple: 'shadow-purple-500/25',
    orange: 'shadow-orange-500/25'
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`absolute inset-0 rounded-lg blur-xl transition-opacity duration-300 ${
          isHovered ? 'opacity-75' : 'opacity-0'
        } ${glowColors[glowColor as keyof typeof glowColors]}`}
        animate={{
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
      />
      <Card className={`relative z-10 transition-all duration-300 ${
        isHovered ? 'shadow-2xl' : 'shadow-lg'
      }`}>
        {children}
      </Card>
    </motion.div>
  );
}

interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
}

function ParticleBackground({ particleCount = 50, className = '' }: ParticleBackgroundProps) {
  // Use deterministic seed-based random generation to avoid hydration mismatches
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const seed = i * 12345;

    return {
      id: i,
      x: Math.round(seededRandom(seed) * 10000) / 100, // Round to 2 decimal places
      y: Math.round(seededRandom(seed + 1) * 10000) / 100, // Round to 2 decimal places
      size: Math.round((seededRandom(seed + 2) * 4 + 1) * 100) / 100, // Round to 2 decimal places
      delay: Math.round(seededRandom(seed + 3) * 2 * 100) / 100, // Round to 2 decimal places
      duration: Math.round((3 + seededRandom(seed + 4) * 2) * 100) / 100 // Round to 2 decimal places
    };
  });

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-400/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '', className = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isInView]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onViewportEnter={() => setIsInView(true)}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
}

interface ParallaxElementProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

function ParallaxElement({ children, offset = 50, className = '' }: ParallaxElementProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className={className}
      style={{ y: springY }}
    >
      {children}
    </motion.div>
  );
}

interface InteractiveFeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  metrics: { label: string; value: string; color: string }[];
  glowColor?: string;
  onHover?: () => void;
}

function InteractiveFeatureCard({
  icon: Icon,
  title,
  description,
  benefits,
  metrics,
  glowColor = 'blue',
  onHover
}: InteractiveFeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHover = () => {
    onHover?.();
    trackLandingPageEvent('feature_interaction', {
      action: 'feature_hover',
      feature_title: title
    });
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    trackLandingPageEvent('feature_interaction', {
      action: 'feature_click',
      feature_title: title,
      expanded: !isExpanded
    });
  };

  return (
    <GlowingCard glowColor={glowColor} onClick={handleClick} onHover={handleHover}>
      <CardContent className="p-6">
        <motion.div
          className="flex items-start gap-4"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              glowColor === 'blue' ? 'bg-blue-100 text-blue-600' :
              glowColor === 'green' ? 'bg-green-100 text-green-600' :
              glowColor === 'purple' ? 'bg-purple-100 text-purple-600' :
              'bg-orange-100 text-orange-600'
            }`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>

          <div className="flex-1">
            <motion.h3
              className="text-lg font-semibold mb-2"
              whileHover={{ color: '#3b82f6' }}
            >
              {title}
            </motion.h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>

            <motion.div
              animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-3">
                <div className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-2 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className={`text-lg font-bold ${metric.color}`}>
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {metric.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="mt-4 flex items-center gap-2 text-sm text-blue-600 cursor-pointer"
              whileHover={{ x: 5 }}
            >
              <span>{isExpanded ? 'Show less' : 'Learn more'}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </GlowingCard>
  );
}

interface EnhancedStatsSectionProps {
  className?: string;
}

export function EnhancedStatsSection({ className = '' }: EnhancedStatsSectionProps) {
  const stats = [
    {
      icon: Shield,
      value: 1,
      suffix: '',
      label: 'Every Asset Has a Purpose',
      description: 'Function-based anchoring, not location',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Zap,
      value: 2,
      suffix: '',
      label: 'Risk Sets the Rhythm',
      description: 'Maintenance frequency by criticality',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Star,
      value: 3,
      suffix: '',
      label: 'Respond to the Real World',
      description: 'Treat plans as hypotheses and roll with the punches',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Users,
      value: 4,
      suffix: '',
      label: 'Operate with Margin',
      description: 'Build practical slack, create room to recover',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <motion.section
      className={`py-16 relative overflow-hidden ${className}`}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <ParticleBackground particleCount={30} />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            The Aegrid Rules in Action
          </h2>
          <p className="text-lg text-muted-foreground">
            See how four simple principles transform complex asset management into intelligent, resilient systems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="text-center p-6 relative overflow-hidden h-full flex flex-col">
                <FloatingElement delay={index * 0.2}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </FloatingElement>

                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2}
                  />
                </div>

                <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-600 mt-auto">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export {
    AnimatedCounter, FloatingElement,
    GlowingCard, InteractiveFeatureCard, ParallaxElement, ParticleBackground
};
