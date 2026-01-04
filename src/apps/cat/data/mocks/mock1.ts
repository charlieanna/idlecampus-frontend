import { MockTest } from '../types';

export const mockTest1: MockTest = {
  id: 'mock-cat-2024-1',
  title: 'All India Mock CAT 1 (AIMCAT)',
  description: 'Full length test based on the latest CAT 2024 pattern. 66 Questions.',
  totalDurationMinutes: 120,
  sections: [
    {
      id: 'varc',
      type: 'VARC',
      title: 'Verbal Ability & Reading Comprehension',
      durationMinutes: 40,
      description: '24 Questions. Focus on RC and Para Jumbles.',
      problemIds: [], // To be populated
      problemSetIds: ['rc-set-1'] // Using our sample RC set
    },
    {
      id: 'dilr',
      type: 'DILR',
      title: 'Data Interpretation & Logical Reasoning',
      durationMinutes: 40,
      description: '20 Questions. 4 Sets of 5 questions each.',
      problemIds: [],
      problemSetIds: ['dilr-set-1'] // Using our sample DILR set
    },
    {
      id: 'quant',
      type: 'QUANT',
      title: 'Quantitative Aptitude',
      durationMinutes: 40,
      description: '22 Questions. Arithmetic, Algebra, Geometry.',
      problemIds: ['tw-q1', 'tw-q2'], // Using our sample Quant questions
      problemSetIds: []
    }
  ]
};
