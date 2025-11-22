import React from 'react';

export interface PanelProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
  border?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Panel component - consistent container styling
 * Maps to Figma: Panel frame component
 */
export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = true,
  border = true,
}) => {
  const baseStyles = 'bg-white rounded-lg';
  const shadowStyles = shadow ? 'shadow-md' : '';
  const borderStyles = border ? 'border border-gray-200' : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${paddingStyles[padding]}
        ${shadowStyles}
        ${borderStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};

