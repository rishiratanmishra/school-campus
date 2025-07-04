'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { sidebarItems } from '../NavigationConfig';
import { getInitials } from '@/components/helpers/helpers';
const dashboardName = 'School Campus';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.2 } },
  closed: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={
          isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)
            ? 'open'
            : 'closed'
        }
        variants={sidebarVariants}
        className="fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border shadow-lg lg:relative lg:z-auto"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {getInitials(dashboardName)}
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {dashboardName || 'Dashboard'}
              </span>
            </div>
            <button
              className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {sidebarItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  item.active
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.a>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  JD
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Rishi Ratan Mishra
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  rishiratanmishra2@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
