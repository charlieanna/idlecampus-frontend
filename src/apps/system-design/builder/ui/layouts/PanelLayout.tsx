import React from 'react';
import { Panel } from '../design-system';

export interface PanelLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PanelLayout - Consistent panel layout with optional header
 * Maps to Figma: PanelLayout frame
 */
export const PanelLayout: React.FC<PanelLayoutProps> = ({
  children,
  title,
  actions,
  className = '',
}) => {
  return (
    <Panel className={`flex flex-col h-full ${className}`} padding="none">
      {/* Panel Header */}
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </Panel>
  );
};

