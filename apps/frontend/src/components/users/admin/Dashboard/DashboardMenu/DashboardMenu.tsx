import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardMenuConfig } from './DashboardMenuConfig';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

const DashboardMenu = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openedGroups, setOpenedGroups] = useState<Set<string>>(new Set());

  const selected = dashboardMenuConfig.find(
    (group) => group.category === activeGroup
  );
  const [showEsc, setShowEsc] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowEsc((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleItemClick = async (action?: () => void | Promise<void>) => {
    if (!action) return;
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupChange = (group: string | null) => {
    if (group) {
      setOpenedGroups((prev) => new Set(prev).add(group));
    }
    setActiveGroup(group);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        if (activeGroup) {
          handleGroupChange(null);
        }
      }
      if (!e.altKey) return;

      if (!activeGroup) {
        const group = dashboardMenuConfig.find(
          (g) => g.shortcut?.toLowerCase() === key
        );
        if (group) handleGroupChange(group.category);
      } else {
        if (key === 'escape') {
          handleGroupChange(null);
        } else {
          const idx = parseInt(key, 10);
          if (!isNaN(idx)) {
            const item = selected?.items[idx - 1];
            if (item) handleItemClick(item.action);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGroup, selected]);

  return (
    <div className="relative w-full h-full flex items-center px-4 py-3 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {activeGroup && selected && (
          <motion.div
            key={activeGroup}
            layout
            initial={
              !openedGroups.has(activeGroup)
                ? { opacity: 0, x: -20 }
                : undefined
            }
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 28,
              duration: 0.4,
            }}
            className="flex gap-4 items-start w-full relative"
          >
            <motion.div
              key="selected-icon"
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                delay: 0.1,
              }}
              className="p-2.5 rounded-lg bg-primary/90 text-primary-foreground shadow-md shrink-0 sticky top-0"
            >
              {selected.icon}
            </motion.div>

            <div className="overflow-x-auto hide-scrollbar w-full pr-32">
              <motion.div
                key="submenu-items"
                className="flex gap-3"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.15,
                    },
                  },
                }}
              >
                {selected.items.map((item, i) => (
                  <motion.button
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, y: 10, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleItemClick(item.action)}
                    className={cn(
                      'group',
                      'bg-card border border-border/50 rounded-lg p-3 flex items-center gap-2 relative',
                      'shadow-sm hover:shadow-md transition-all min-w-[160px]',
                      'hover:bg-muted/50 active:bg-muted',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                      'max-sm:min-w-[120px] shrink-0'
                    )}
                  >
                    <span className="text-primary/90">{item.icon}</span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-left">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground/80 text-left">
                          {item.description}
                        </span>
                      )}
                    </div>
                    {selected.itemShortcuts?.[i] && (
                      <span className="absolute bottom-1 right-1 text-[10px] text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {selected.itemShortcuts[i]}
                      </span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Sticky Back Button */}
            <div className="sticky top-3 right-3 z-20">
              <motion.button
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleGroupChange(null)}
                className="w-[70px] flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />

                <AnimatePresence mode="wait">
                  <motion.span
                    key={showEsc ? 'esc' : 'back'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="max-sm:hidden"
                  >
                    {showEsc ? 'ESC' : 'Back'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeGroup && (
          <motion.div
            key="main-menu"
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            className="flex gap-3 w-full pb-3"
          >
            <div className="flex gap-3 overflow-x-auto w-full hide-scrollbar">
              {dashboardMenuConfig.map((group) => (
                <motion.button
                  key={group.category}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleGroupChange(group.category)}
                  className={cn(
                    'group',
                    'p-2.5 rounded-lg min-w-[50px] flex justify-center items-center relative',
                    'bg-muted/50 hover:bg-muted border border-border/50',
                    'shadow-sm hover:shadow-md transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                    'max-sm:min-w-[40px] max-sm:p-2 shrink-0',
                    'pt-4'
                  )}
                >
                  {group.icon}
                  {group.shortcut && (
                    <span className="absolute top-1 -right-1.5 text-[10px] bg-primary text-white rounded-full px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {group.shortcut.toUpperCase()}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default DashboardMenu;
