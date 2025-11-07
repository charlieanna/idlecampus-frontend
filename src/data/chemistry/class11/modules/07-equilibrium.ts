/**
 * Module 7: Chemical Equilibrium and Ionic Equilibrium
 */

import type { ChemistryModule } from '../../types';

export const equilibriumModule: ChemistryModule = {
  id: 'class11-equilibrium',
  slug: 'equilibrium',
  title: 'Chemical Equilibrium and Ionic Equilibrium',
  description: 'Master equilibrium concepts, Le Chatelier\'s principle, pH, buffers, and solubility.',
  icon: 'scale',
  sequenceOrder: 7,
  estimatedHours: 18,
  topic: 'physical',
  difficulty: 'hard',
  prerequisites: ['class11-thermodynamics'],
  learningOutcomes: [
    'Understand dynamic equilibrium and equilibrium constant',
    'Apply Le Chatelier\'s principle',
    'Calculate pH and pOH of solutions',
    'Understand buffer solutions and their applications',
    'Apply Henderson-Hasselbalch equation',
    'Calculate solubility product (Ksp)',
    'Understand common ion effect',
  ],
  items: [],
};
