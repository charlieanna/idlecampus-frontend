import React from 'react';

export interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * MainLayout - Overall application layout structure
 * Maps to Figma: MainLayout frame
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  footer,
  className = '',
}) => {
  return (
    <div className={`h-screen w-screen flex flex-col bg-gray-50 ${className}`}>
      {header && (
        <header className="flex-shrink-0">
          {header}
        </header>
      )}
      
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      
      {footer && (
        <footer className="flex-shrink-0">
          {footer}
        </footer>
      )}
    </div>
  );
};

