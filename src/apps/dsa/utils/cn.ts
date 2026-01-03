import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 * 
 * @example
 * cn('px-4 py-2', 'px-2') // => 'py-2 px-2' (px-2 overrides px-4)
 * cn('bg-red-500', someCondition && 'bg-blue-500') // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}