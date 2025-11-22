import React from 'react';
import { APIsReference } from '../components/APIsReference';

/**
 * APIsPage - API reference documentation
 * Maps to Figma: APIsPage frame
 */
export const APIsPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto">
      <APIsReference />
    </div>
  );
};

