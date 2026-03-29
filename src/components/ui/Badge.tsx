import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-muted text-muted-foreground': variant === 'default',
          'bg-primary/10 text-primary': variant === 'primary',
          'bg-success/10 text-success': variant === 'success',
          'bg-warning/10 text-warning': variant === 'warning',
          'bg-danger/10 text-danger': variant === 'danger',
          'border border-border text-muted-foreground': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
