"use client";

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Touch,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipe?: (direction: 'left' | 'right') => void;
  className?: string;
}

function SwipeableCard({ children, onSwipe, className = '' }: SwipeableCardProps) {
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-100, 0, 100], [0.95, 1, 0.95]);

  const handleDragStart = (event: any, info: any) => {
    setDragStart(info.point.x);
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const deltaX = info.point.x - dragStart;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipe?.('right');
      } else {
        onSwipe?.('left');
      }
    }

    // Reset position
    x.set(0);
  };

  return (
    <motion.div
      className={className}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ x, opacity, scale }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

function TouchOptimizedButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const handlePress = () => {
    setIsPressed(true);
    onClick?.();
    trackLandingPageEvent('feature_interaction', {
      action: 'touch_button_press',
      button_text: typeof children === 'string' ? children : 'button'
    });
    
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <motion.button
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${className}
        rounded-lg font-semibold transition-colors
        touch-manipulation select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={handlePress}
      disabled={disabled}
      whileTap={{ scale: isPressed ? 0.95 : 1 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.1 }}
      style={{ minHeight: size === 'lg' ? '56px' : size === 'md' ? '48px' : '40px' }}
    >
      {children}
    </motion.button>
  );
}

interface MobileCarouselProps {
  items: Array<{
    id: string;
    title: string;
    description: string;
    image?: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string;
  }>;
  className?: string;
}

function MobileCarousel({ items, className = '' }: MobileCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isAutoPlaying]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    trackLandingPageEvent('feature_interaction', {
      action: 'carousel_navigate',
      slide_index: index
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-lg">
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-full flex-shrink-0">
              <SwipeableCard onSwipe={handleSwipe}>
                <Card className="h-64">
                  <CardContent className="p-6 h-full flex flex-col justify-center text-center">
                    {item.badge && (
                      <Badge variant="secondary" className="mb-4 w-fit mx-auto">
                        {item.badge}
                      </Badge>
                    )}
                    
                    {item.icon && (
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </SwipeableCard>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <TouchOptimizedButton
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </TouchOptimizedButton>
          
          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {items.length}
          </div>
        </div>

        <div className="flex gap-2">
          <TouchOptimizedButton
            variant="outline"
            size="sm"
            onClick={() => handleSwipe('right')}
            disabled={items.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </TouchOptimizedButton>
          
          <TouchOptimizedButton
            variant="outline"
            size="sm"
            onClick={() => handleSwipe('left')}
            disabled={items.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </TouchOptimizedButton>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  mobileCols?: number;
  tabletCols?: number;
  desktopCols?: number;
  gap?: number;
  className?: string;
}

function ResponsiveGrid({ 
  children, 
  mobileCols = 1, 
  tabletCols = 2, 
  desktopCols = 3,
  gap = 6,
  className = ''
}: ResponsiveGridProps) {
  const gridTemplateColumns = {
    mobile: `repeat(${mobileCols}, 1fr)`,
    tablet: `repeat(${tabletCols}, 1fr)`,
    desktop: `repeat(${desktopCols}, 1fr)`
  };

  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: gridTemplateColumns.mobile,
        '@media (min-width: 768px)': {
          gridTemplateColumns: gridTemplateColumns.tablet
        },
        '@media (min-width: 1024px)': {
          gridTemplateColumns: gridTemplateColumns.desktop
        }
      }}
    >
      {children}
    </div>
  );
}

interface DevicePreviewProps {
  className?: string;
}

function DevicePreview({ className = '' }: DevicePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const devices = [
    { type: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
    { type: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { type: 'desktop' as const, icon: Monitor, label: 'Desktop' }
  ];

  const deviceSizes = {
    mobile: 'w-64 h-96',
    tablet: 'w-80 h-96',
    desktop: 'w-96 h-64'
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-center gap-4 mb-6">
        {devices.map((device) => (
          <TouchOptimizedButton
            key={device.type}
            variant={selectedDevice === device.type ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedDevice(device.type)}
          >
            <device.icon className="w-4 h-4 mr-2" />
            {device.label}
          </TouchOptimizedButton>
        ))}
      </div>

      <motion.div
        key={selectedDevice}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`${deviceSizes[selectedDevice]} mx-auto bg-gray-100 rounded-lg border-4 border-gray-300 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 p-4">
          <div className="h-full bg-white rounded-lg shadow-inner flex items-center justify-center">
            <div className="text-center">
              <Touch className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Optimized for {selectedDevice}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface MobileOptimizedSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  showDevicePreview?: boolean;
  className?: string;
}

export default function MobileOptimizedSection({
  title,
  description,
  children,
  showDevicePreview = false,
  className = ''
}: MobileOptimizedSectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        {showDevicePreview && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <DevicePreview />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export {
  SwipeableCard,
  TouchOptimizedButton,
  MobileCarousel,
  ResponsiveGrid,
  DevicePreview
};
