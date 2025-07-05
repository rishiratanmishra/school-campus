import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { themes } from '../Themes/ThemeCampus';
import { convertObjectNameToString, getInitials } from '@/components/helpers/helpers';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  handleThemeChange: (theme: string) => void;
  handleLogout: () => void;
  user: any;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  isOpen,
  onClose,
  theme,
  isDarkMode,
  toggleDarkMode,
  handleThemeChange,
  handleLogout,
  user,
}) => {
  const [themeMenuOpen, setThemeMenuOpen] = React.useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-border/50">
            <div className="text-sm font-medium">
              {convertObjectNameToString(user?.name) || 'U'}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.email || 'user@example.com'}
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
              onClick={(e) => {
                e.stopPropagation();
                setThemeMenuOpen(!themeMenuOpen);
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="h-4 w-4 mr-3 rounded-full bg-primary" />
                Themes
              </div>
              <motion.div
                animate={{ rotate: themeMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <AnimatePresence>
              {themeMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-muted/20 overflow-hidden"
                >
                  {themes.map((t) => (
                    <button
                      key={t}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThemeChange(t);
                      }}
                      className={`w-full flex items-center px-8 py-2 text-left text-sm hover:bg-muted/30 transition-colors ${
                        theme === t
                          ? 'font-medium text-primary bg-muted/20'
                          : ''
                      }`}
                    >
                      <div
                        className={`h-3 w-3 mr-2 rounded-full ${
                          theme === t ? 'bg-primary' : 'bg-muted-foreground'
                        }`}
                      />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-border/50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className="w-full flex items-center px-4 py-2 text-sm hover:bg-muted/50 transition-colors text-destructive"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};