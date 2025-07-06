'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/auth/AuthenticationSlice';
import { cn } from '@/lib/utils';

type UserRole = 'USER' | 'STUDENT' | 'ADMIN' | 'TEACHER' | 'PARENT';

interface User {
  _id: string;
  name: {
    first: string;
    middle: string;
    last: string;
  };
  email: string;
  role: UserRole;
  isActive: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const roleColors: Record<UserRole, string> = {
  STUDENT: 'bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]',
  TEACHER: 'bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]',
  ADMIN: 'bg-[hsl(var(--chart-4))]/20 text-[hsl(var(--chart-4))]',
  PARENT: 'bg-[hsl(var(--chart-3))]/20 text-[hsl(var(--chart-3))]',
  USER: 'bg-muted text-muted-foreground',
};

const UserProfileCard = () => {
  const user = useSelector(selectCurrentUser) as User | null;

  if (!user) return null;

  const fullName =
    `${user.name.first} ${user.name.middle} ${user.name.last}`.trim();
  const initials =
    `${user.name.first[0] ?? ''}${user.name.last[0] ?? ''}`.toUpperCase();
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <Card className="rounded-xl p-6 bg-background/70 shadow-md">
        <div className="flex flex-col items-center text-center gap-2">
          {/* Avatar */}
          <Avatar className="h-16 w-16 border shadow mb-2 bg-card">
            <AvatarFallback className="text-lg font-bold text-foreground bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <h2 className="text-lg font-semibold text-foreground">{fullName}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          {/* Role Badge */}
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium mt-1',
              roleColors[user.role]
            )}
          >
            {user.role}
          </span>

          {/* Joined Date */}
          <p className="text-xs text-muted-foreground mt-1">
            Joined on {joinDate}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default UserProfileCard;
