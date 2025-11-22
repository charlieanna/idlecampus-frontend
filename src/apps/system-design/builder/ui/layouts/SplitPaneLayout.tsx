import React, { useState, useRef, useEffect } from 'react';

export interface SplitPaneLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

/**
 * SplitPaneLayout - Resizable split pane layout
 * Maps to Figma: SplitPaneLayout frame
 */
export const SplitPaneLayout: React.FC<SplitPaneLayoutProps> = ({
  left,
  right,
  defaultLeftWidth = 384,  // 24rem
  minLeftWidth = 256,      // 16rem
  maxLeftWidth = 640,      // 40rem
  className = '',
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;

      if (newWidth >= minLeftWidth && newWidth <= maxLeftWidth) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  return (
    <div
      ref={containerRef}
      className={`flex h-full ${className}`}
    >
      {/* Left Pane */}
      <div
        style={{ width: `${leftWidth}px` }}
        className="flex-shrink-0 overflow-auto"
      >
        {left}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className={`
          w-1 bg-gray-200 hover:bg-blue-500 cursor-col-resize
          transition-colors flex-shrink-0
          ${isDragging ? 'bg-blue-500' : ''}
        `.trim()}
      />

      {/* Right Pane */}
      <div className="flex-1 overflow-auto">
        {right}
      </div>
    </div>
  );
};

export interface VerticalSplitPaneLayoutProps {
  top: React.ReactNode;
  bottom: React.ReactNode;
  defaultTopHeight?: number;
  minTopHeight?: number;
  maxTopHeight?: number;
  className?: string;
}

/**
 * VerticalSplitPaneLayout - Vertically resizable split pane layout
 */
export const VerticalSplitPaneLayout: React.FC<VerticalSplitPaneLayoutProps> = ({
  top,
  bottom,
  defaultTopHeight = 384,
  minTopHeight = 256,
  maxTopHeight = 640,
  className = '',
}) => {
  const [topHeight, setTopHeight] = useState(defaultTopHeight);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - containerRect.top;

      if (newHeight >= minTopHeight && newHeight <= maxTopHeight) {
        setTopHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minTopHeight, maxTopHeight]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full ${className}`}
    >
      {/* Top Pane */}
      <div
        style={{ height: `${topHeight}px` }}
        className="flex-shrink-0 overflow-auto"
      >
        {top}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className={`
          h-1 bg-gray-200 hover:bg-blue-500 cursor-row-resize
          transition-colors flex-shrink-0
          ${isDragging ? 'bg-blue-500' : ''}
        `.trim()}
      />

      {/* Bottom Pane */}
      <div className="flex-1 overflow-auto">
        {bottom}
      </div>
    </div>
  );
};

