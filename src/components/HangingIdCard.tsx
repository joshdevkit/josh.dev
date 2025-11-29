import { motion, useMotionValue, useTransform } from "framer-motion";
import { portfolioContent } from "@/config/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Maximize2, ChevronsLeftRight } from "lucide-react";
import { useState, useEffect } from "react";

export const HangingIdCard = () => {
  const { idCard } = portfolioContent;
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for drag position - start stretched to bottom
  const initialStretch = typeof window !== 'undefined' ? window.innerHeight - 250 : 500;
  const x = useMotionValue(0);
  const y = useMotionValue(initialStretch);

  // Calculate lanyard length based on distance from anchor point
  const lanyardLength = useTransform([x, y], ([xVal, yVal]) => {
    const xNum = Number(xVal);
    const yNum = Number(yVal);
    const distance = Math.sqrt(xNum * xNum + yNum * yNum);
    return Math.max(80, 80 + distance * 1.2); // Base length 80px, stretches more dynamically
  });

  // Reset motion values when showing the card - stretch to bottom
  useEffect(() => {
    if (isVisible) {
      const stretch = window.innerHeight - 450;
      x.set(0);
      y.set(stretch);
    }
  }, [isVisible, x, y]);

  const handleShow = () => {
    setIsVisible(true);
    // Reset position - stretch to bottom
    const stretch = window.innerHeight - 250;
    x.set(0);
    y.set(stretch);
  };

  if (!isVisible) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-8 right-12 z-50 hidden lg:flex flex-col items-center gap-2"
    >
      {/* Click Me Text Animation */}
      <motion.span
        animate={{ 
          y: [0, -6, 0],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
        className="text-sm text-gray-700"
      >
        Click Me
      </motion.span>

      {/* Animated Button */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
      >
        <Button
          onClick={handleShow}
          size="icon"
          variant="outline"
          className="rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronsLeftRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

  return (
    <div className="fixed top-8 right-12 z-50 hidden lg:block">
      {/* Fixed anchor point */}
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-muted border-2 border-border shadow-md flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
        </div>

        {/* Elastic Lanyard - SVG line that follows the card */}
        <motion.svg
          className="absolute top-4 left-4 pointer-events-none"
          style={{
            width: "600px",
            height: "800px",
            overflow: "visible",
          }}
        >
          <motion.line
            x1="0"
            y1="0"
            x2={x}
            y2={lanyardLength}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            strokeOpacity="0.4"
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
          {/* Shadow line for depth */}
          <motion.line
            x1="0"
            y1="0"
            x2={x}
            y2={lanyardLength}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="4"
            strokeOpacity="0.1"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Lanyard clip at anchor */}
        <div className="absolute top-8 left-1 w-6 h-3 bg-muted-foreground/40 rounded-b-lg" />
      </div>

      {/* Draggable ID Card */}
      <motion.div
        key="id-card-draggable"
        drag
        dragElastic={0.3}
        dragMomentum={false}
        dragConstraints={{
          top: -100,
          left: -200,
          right: 200,
          bottom: 300,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{ 
          x, 
          y,
          transformStyle: "preserve-3d"
        }}
        initial={{ opacity: 0, rotateX: -15 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={
          !isDragging
            ? {
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 },
              }
            : {}
        }
        whileDrag={{
          scale: 1.1,
          rotateZ: 5,
          cursor: "grabbing",
        }}
        className="relative cursor-grab active:cursor-grabbing mt-20"
      >
        {/* Hide button */}
        <Button
          onClick={() => setIsVisible(false)}
          size="icon"
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive/90 hover:bg-destructive text-destructive-foreground z-10 shadow-md"
        >
          <X className="w-3 h-3" />
        </Button>

        <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden w-64 relative">
          {/* Card Header with gradient */}
          <div className="bg-gradient-to-br from-primary to-primary/80 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
            <h3 className="text-primary-foreground font-semibold text-sm relative z-10">
              {idCard.company}
            </h3>
            <p className="text-primary-foreground/80 text-xs relative z-10">Employee ID Card</p>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3">
            {/* Photo */}
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg bg-accent overflow-hidden border-2 border-primary/20 flex-shrink-0">
                <img
                  src={idCard.photo}
                  alt={idCard.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-sm truncate">
                  {idCard.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{idCard.role}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {idCard.id}
                </Badge>
              </div>
            </div>

            {/* Barcode/QR simulation */}
            <div className="border-t border-border pt-3">
              <div className="flex justify-center">
                <div className="bg-foreground/5 rounded p-2">
                  <div className="flex gap-[2px]">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-foreground/80 rounded-sm"
                        style={{ height: `${Math.random() * 20 + 20}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="text-[10px] text-muted-foreground text-center border-t border-border pt-2">
              <p>Valid: 2024 • Access Level: All Areas</p>
            </div>
          </div>
        </div>

        {/* Card shadow effect */}
        <div className="absolute inset-0 -z-10 blur-xl opacity-30 bg-primary rounded-xl" />
      </motion.div>
    </div>
  );
};
