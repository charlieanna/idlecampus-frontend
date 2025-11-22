import React from 'react';

export interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const positionStyles = {
  top: 'border-b border-gray-200',
  bottom: 'border-t border-gray-200',
  left: 'border-r border-gray-200',
  right: 'border-l border-gray-200',
};

/**
 * Toolbar component - action bar container
 * Maps to Figma: Toolbar component
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  className = '',
  position = 'top',
}) => {
  return (
    <div
      className={`
        bg-white px-4 py-2 flex items-center gap-2
        ${positionStyles[position]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};

export interface ToolbarGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
};

export interface ToolbarSeparatorProps {
  className?: string;
}

export const ToolbarSeparator: React.FC<ToolbarSeparatorProps> = ({
  className = '',
}) => {
  return <div className={`w-px h-6 bg-gray-300 ${className}`} />;
};

