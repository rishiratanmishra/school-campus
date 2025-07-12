'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, Sun, Moon, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import { themes } from '../Themes/ThemeCampus';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, clearAuth } from '@/store/auth/AuthenticationSlice';
import { AppDispatch } from '@/store';
import {
  convertObjectNameToString,
  getInitials,
} from '@/components/helpers/helpers';
import {
  themeStorage,
  LOCAL_STORAGE_DARK_KEY,
  LOCAL_STORAGE_THEME_KEY,
} from '../Themes/ThemeStorage';
import { UserDropdown } from './UserDropdown';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<string>('default');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Redux selectors
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load theme settings on mount
  useEffect(() => {
    if (!isClient) return;

    const savedTheme = themeStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    const savedDark = themeStorage.getItem(LOCAL_STORAGE_DARK_KEY);

    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
    }
    if (savedDark) {
      setIsDarkMode(savedDark === 'true');
    }
    setLoaded(true);
  }, [isClient]);

  // Apply theme classes and save to storage
  useEffect(() => {
    if (!loaded || !isClient) return;

    const root = document.documentElement;

    // Remove all theme classes
    themes.forEach((t) => root.classList.remove(`theme-${t}`));

    // Add current theme class
    root.classList.add(`theme-${theme}`);

    // Toggle dark mode
    root.classList.toggle('dark', isDarkMode);

    // Save to storage
    themeStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    themeStorage.setItem(LOCAL_STORAGE_DARK_KEY, String(isDarkMode));
  }, [theme, isDarkMode, loaded, isClient]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setDropdownOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isClient]);

  // Handle escape key to close dropdowns
  useEffect(() => {
    if (!isClient) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isClient]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    dispatch(clearAuth());

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('auth-tokens');
        localStorage.removeItem('user-data');
      } catch (error) {
        console.warn('Failed to clear localStorage during logout');
      }
    }

    router.push('/login');
  }, [dispatch, router]);

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
  }, []);

  if (!isClient || !loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                {/* Notifications */}
                <div className="relative" data-dropdown>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotificationOpen(!notificationOpen);
                      setDropdownOpen(false);
                    }}
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
                        onClick={(e) => e.stopPropagation()}
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
                                New assignment posted
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Math homework due tomorrow
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

                {/* Dark mode toggle */}
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

                {/* User profile dropdown */}
                <div className="relative" data-dropdown>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                      setNotificationOpen(false);
                    }}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-muted transition-colors"
                    aria-label="User profile"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {getInitials(convertObjectNameToString(user?.name))}
                      </span>
                    </div>
                  </button>

                  <UserDropdown
                    isOpen={dropdownOpen}
                    onClose={() => setDropdownOpen(false)}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleThemeChange={handleThemeChange}
                    handleLogout={handleLogout}
                    user={user}
                  />
                </div>
              </div>
            </div>
          </motion.header>

          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
