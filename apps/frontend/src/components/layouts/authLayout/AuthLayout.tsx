'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, Menu, Sun, Moon, ChevronRight, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';

const themes = [
  'default',
  'red',
  // 'blue',
  'green',
  'yellow',
  'purple',
  'pink',
  'cyan',
  'orange',
  'teal',
];

const LOCAL_STORAGE_THEME_KEY = 'myApp-theme';
const LOCAL_STORAGE_DARK_KEY = 'myApp-darkMode';

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-30 bg-card shadow-sm border-b border-border"
          >
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <button
                className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <h1 className="text-lg font-semibold text-foreground flex-1">
                Dashboard
              </h1>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
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

                <button
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-muted"
                    aria-label="User profile"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        JD
                      </span>
                    </div>
                  </button>

                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50"
                    >
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                        Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                        Account Settings
                      </button>

                      {/* Theme submenu */}
                      <div>
                        <button
                          onClick={() => setThemeMenuOpen((prev) => !prev)}
                          className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted"
                        >
                          Themes
                          {themeMenuOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>

                        {themeMenuOpen && (
                          <div className="bg-muted/40">
                            {themes.map((t) => (
                              <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`w-full px-6 py-1 text-left text-sm hover:bg-muted ${
                                  theme === t ? 'font-bold text-primary' : ''
                                }`}
                              >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.header>

          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 sm:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
