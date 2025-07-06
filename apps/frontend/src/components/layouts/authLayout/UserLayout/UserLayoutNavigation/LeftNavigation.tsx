'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Home,
  Users,
  Calendar,
  ClipboardList,
  BookOpen,
  Bell,
  MessageSquare,
  Settings,
  School,
  LogOut,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth, selectCurrentUser } from '@/store/auth/AuthenticationSlice';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const navigationItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: BookOpen, label: 'Courses', href: '/courses' },
  {
    icon: ClipboardList,
    label: 'Assignments',
    href: '/assignments',
    badge: '3',
  },
  { icon: Calendar, label: 'Schedule', href: '/schedule' },
  { icon: MessageSquare, label: 'Messages', href: '/messages', badge: '5' },
  { icon: Bell, label: 'Notifications', href: '/notifications', badge: '2' },
];

const settingsItems = [
  { icon: Users, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const LeftNavigation = () => {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const getUserInitials = () => {
    if (!user) return 'US';
    return `${user.name.first[0]}${user.name.last[0]}`.toUpperCase();
  };

  const getUserName = () => {
    if (!user) return 'User';
    return `${user.name.first} ${user.name.last}`;
  };

  const getUserRole = () => {
    if (!user) return 'Student';
    return user.role.charAt(0) + user.role.slice(1).toLowerCase();
  };

  const handleLogout = useCallback(() => {
    dispatch(clearAuth());
    localStorage.removeItem('auth-tokens');
    localStorage.removeItem('user-data');
    router.push('/login');
  }, [dispatch, router]);

  return (
    <div className="hidden lg:flex lg:w-72 h-full flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Logo/Header */}
      <div className="px-6 py-5 border-b">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <School className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">
            School Campus
          </h1>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              asChild
              variant={item.active ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-11 hover:bg-accent/40 transition-colors',
                item.active && 'bg-accent font-medium'
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-primary/10 text-primary">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          </motion.div>
        ))}
      </nav>

      {/* Settings Section */}
      <div className="px-3 py-2 border-t">
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: (navigationItems.length + index) * 0.05 }}
          >
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-muted-foreground hover:bg-muted"
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 border-t bg-background/90"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border bg-card">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {getUserName()}
              </p>
              <p className="text-xs text-muted-foreground">{getUserRole()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LeftNavigation;
