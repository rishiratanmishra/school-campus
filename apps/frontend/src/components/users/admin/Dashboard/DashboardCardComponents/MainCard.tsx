import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MainCardProps {
  title: string;
  description: string;
  footer?: boolean;
  children?: React.ReactNode;
}

export const MainCard: React.FC<MainCardProps> = ({
  title,
  description,
  footer = false,
  children,
}) => {
  return (
    <Card className="w-full shadow-sm border rounded-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footer && (
        <CardFooter className="pt-2">
          <p className="text-sm text-muted-foreground">
            Last updated 5 mins ago
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

interface QuickActionItem {
  label: string;
  icon: LucideIcon;
  variant?: 'default' | 'secondary';
  onClick?: () => void;
}

interface QuickActionsCardProps {
  title: string;
  actions: QuickActionItem[];
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  title,
  actions,
}) => {
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`w-full flex items-center px-4 py-2 rounded-md text-sm font-medium 
              ${
                action.variant === 'default'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              } gap-2`}
          >
            <action.icon size={18} />
            {action.label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};
