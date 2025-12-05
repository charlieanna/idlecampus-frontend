import React from 'react';
import { Tabs, Tab } from '../design-system';

export interface TabLayoutProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}

/**
 * TabLayout - Layout with tab navigation
 * Maps to Figma: TabLayout frame
 */
export const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  toolbar,
  className = '',
}) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Tab Navigation */}
      <div className="flex-shrink-0 bg-white px-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
      </div>

      {/* Optional Toolbar */}
      {toolbar && (
        <div className="flex-shrink-0">
          {toolbar}
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
};

