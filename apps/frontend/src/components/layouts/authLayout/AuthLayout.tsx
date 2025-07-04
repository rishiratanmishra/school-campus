'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Menu,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import Sidebar from './Sidebar';
import {
  LOCAL_STORAGE_DARK_KEY,
  LOCAL_STORAGE_THEME_KEY,
  themes,
} from '../Themes/ThemeCampus';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [theme, setTheme] = useState<string>('default');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Load from localStorage before render
  useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    const savedDark = localStorage.getItem(LOCAL_STORAGE_DARK_KEY);

    if (savedTheme) setTheme(savedTheme);
    if (savedDark) setIsDarkMode(savedDark === 'true');
    setLoaded(true);
  }, []);

  // Apply theme + dark mode classes & store in localStorage
  useEffect(() => {
    if (!loaded) return;

    const root = document.documentElement;
    themes.forEach((t) => root.classList.remove(`theme-${t}`));
    root.classList.add(`theme-${theme}`);
    root.classList.toggle('dark', isDarkMode);

    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    localStorage.setItem(LOCAL_STORAGE_DARK_KEY, String(isDarkMode));
  }, [theme, isDarkMode, loaded]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border/50"
          >
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <h1 className="text-lg font-semibold text-foreground">
                  School Campus
                </h1>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>

                  <AnimatePresence>
                    {notificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-50 p-2"
                      >
                        <div className="p-2 text-sm font-medium text-center border-b border-border/50">
                          Notifications
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {[1, 2, 3].map((item) => (
                            <div
                              key={item}
                              className="p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
                            >
                              <div className="text-sm font-medium">
                                Notification {item}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                This is a sample notification
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 text-center text-xs text-primary cursor-pointer border-t border-border/50">
                          View all notifications
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Toggle dark mode"
                >
                  <motion.div
                    animate={{ rotate: isDarkMode ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDarkMode ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                  </motion.div>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-muted transition-colors"
                    aria-label="User profile"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        JD
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-4 border-b border-border/50">
                          <div className="text-sm font-medium">Rishi Ratan Mishra</div>
                          <div className="text-xs text-muted-foreground">
                            rishiratanmishra2@gmail.com
                          </div>
                        </div>

                        <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-muted/50 transition-colors">
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-muted/50 transition-colors">
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </button>

                        {/* Theme submenu */}
                        <div>
                          <button
                            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="h-4 w-4 mr-3 rounded-full bg-primary" />
                              Themes
                            </div>
                            {themeMenuOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>

                          <AnimatePresence>
                            {themeMenuOpen && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-muted/20 overflow-hidden"
                              >
                                {themes.map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`w-full flex items-center px-8 py-2 text-left text-sm hover:bg-muted/30 transition-colors ${
                                      theme === t
                                        ? 'font-medium text-primary'
                                        : ''
                                    }`}
                                  >
                                    <div
                                      className={`h-3 w-3 mr-2 rounded-full bg-${t}-500`}
                                    />
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="border-t border-border/50">
                          <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-destructive">
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.header>

          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              // className="p-4 sm:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
