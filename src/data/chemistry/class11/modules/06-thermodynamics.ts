/**
 * Module 6: Chemical Thermodynamics
 */

import type { ChemistryModule } from '../../types';

export const thermodynamicsModule: ChemistryModule = {
  id: 'class11-thermodynamics',
  slug: 'thermodynamics',
  title: 'Chemical Thermodynamics',
  description: 'Study energy changes in chemical reactions including enthalpy, entropy, and Gibbs free energy.',
  icon: 'flame',
  sequenceOrder: 6,
  estimatedHours: 16,
  topic: 'physical',
  difficulty: 'hard',
  prerequisites: ['class11-basic-concepts'],
  learningOutcomes: [
    'Understand system, surroundings, and types of systems',
    'Apply First Law of Thermodynamics (ΔU = q + w)',
    'Calculate enthalpy changes (ΔH) for reactions',
    'Use Hess\'s Law for enthalpy calculations',
    'Understand entropy and Second Law',
    'Apply Gibbs free energy to predict spontaneity',
  ],
  items: [],
};
