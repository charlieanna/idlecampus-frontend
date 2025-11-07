/**
 * Module 12: Hydrocarbons
 */

import type { ChemistryModule } from '../../types';

export const hydrocarbonsModule: ChemistryModule = {
  id: 'class11-hydrocarbons',
  slug: 'hydrocarbons',
  title: 'Hydrocarbons',
  description: 'Study alkanes, alkenes, alkynes, and aromatic hydrocarbons with their reactions.',
  icon: 'flame-kindling',
  sequenceOrder: 12,
  estimatedHours: 18,
  topic: 'organic',
  difficulty: 'hard',
  prerequisites: ['class11-organic-basics'],
  learningOutcomes: [
    'Classify and name hydrocarbons',
    'Understand alkane conformations and reactions',
    'Explain alkene reactions (addition, Markovnikov\'s rule)',
    'Understand alkyne acidity and reactions',
    'Describe aromaticity and Hückel\'s rule',
    'Explain electrophilic aromatic substitution',
    'Understand benzene structure and resonance',
  ],
  items: [],
};
