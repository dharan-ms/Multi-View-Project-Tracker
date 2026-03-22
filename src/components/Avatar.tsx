import React from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ring?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-7 h-7 text-xs',
  lg: 'w-8 h-8 text-sm',
};

export const Avatar: React.FC<AvatarProps> = ({ initials, color, size = 'md', className = '', ring = false }) => (
  <div
    className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${sizeClasses[size]} ${ring ? 'ring-2 ring-white' : ''} ${className}`}
    style={{ backgroundColor: color }}
    title={initials}
  >
    {initials}
  </div>
);
